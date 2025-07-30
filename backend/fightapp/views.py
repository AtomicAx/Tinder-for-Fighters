from .models import UserInfo, EmailVerification
from .Serializers import EmailSerializer, EmailVerificationSerializer, UserInfoSerializer, GoogleLoginSerializer
from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.utils import timezone
from django.conf import settings
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from datetime import timedelta
from backend.services import email_verification
from backend.services.s3_utils import generate_presigned_upload_url
import requests

# send email verification code
@api_view(['POST'])
@permission_classes([AllowAny])
def send_code(request):
    serializer = EmailSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        email_verification.create_and_send_verification(email)
        return Response({'message': f'Code has been sent to {email}'})
    
    return  Response(serializer.errors, status=400)
    
# Email verification
@api_view(['POST'])
@permission_classes([AllowAny])
def verify_email_code(request):
    serializer = EmailVerificationSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        input_code = serializer.validated_data['code']
    
        try:
            verification = EmailVerification.objects.filter(
                email=email, code=input_code, is_used=False
            ).latest('created_at')
        except EmailVerification.DoesNotExist:
            return Response({'success': False, 'detail': 'Invalid or expired code'}, status=400)
    
        verification.delete()
        return Response({'success': True, 'detail': 'Email verified successfully'})
    
    return Response(serializer.errors, status=400)
    

def generate_unique_username(base):
    username = base
    counter = 1
    while User.objects.filter(username=username).exists():
        username = f"{base}{counter}"
        counter += 1
    return username

# picture upload
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def request_profile_upload_url(request):
    content_type = request.data.get('content_type')
    
    if not content_type or not content_type.startswith('image/'):
        return Response({'error': 'Invalid content type'}, status=400)
    
    url, s3_key = generate_presigned_upload_url(request.user.id, content_type)
    return Response({
        'upload_url': url,
        's3_key': s3_key
    })
    
# set profile pic -- add url to DB
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def set_profile_picture(request):
    s3_key = request.data.get('s3_key')
    if not s3_key:
        return Response({'error': 'Missing s3 key'}, status=400)

    user_info = request.user.profile
    user_info.profile_picture_url = f"https://{settings.AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com/{s3_key}"
    user_info.save()
    
    return Response({'message': 'Profile Picture updated'})

# complete onboarding process -- add all onboarding info to user_info table
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def complete_onboarding(request):
    data = request.data
    print({"data:", data})
    username = request.user
    user = User.objects.get(username=username)
    user_info = UserInfo.objects.create()
    
    # this should be in the auth_user table
    user.first_name = data.get('firstName')
    user.last_name = data.get('lastName')
    
    user.save()
    
    # check for profile picture, add if there
    s3_key = data.get('profile_picture_url')
    if s3_key:
        user_info.profile_picture_url = f"https://{settings.AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com/{s3_key}"
        
    # disciplines
    user_info.discipline_primary = data.get('primaryDiscipline')
    user_info.discipline_secondary = data.get('secondaryDiscipline')
    
    # combine city state zip into one string
    city = data.get('city', '')
    state = data.get('state', '')
    zipcode = data.get('zipcode', '')
    user_info.location = f"{city}, {state} {zipcode}".strip()
    
    # get lat and long from google
    user_info.latitude, user_info.longitude = geocode_address(user_info.location)
    
    # rest of the fields
    user_info.nickname = data.get('nickname')
    user_info.date_of_birth = data.get('dob')
    user_info.gender = data.get('gender')
    user_info.phone_number = data.get('phone')
    user_info.weight_lbs = data.get('weight')
    user_info.weight_class = data.get('weightClass')
    user_info.height_in = data.get('height')
    user_info.reach_in = data.get('reach')
    
    user_info.save()
    
    return Response({
        'message': 'Onboarding complete',
        'user_info': UserInfoSerializer(user_info).data
    })
    

# get lat and long from city state and zip
def geocode_address(location):
    result = requests.get(
        "https://maps.googleapis.com/maps/api/geocode/json", 
        params={
            "address": location, 
            "key": settings.GOOGLE_API_KEY
        })
    data = result.json()
    if data.get("status") == "OK":
        location = data["results"][0]["geometry"]["location"]
        return location["lat"], location["lng"]
    return None, None
    
# login/signup with google
@api_view(['POST'])
@permission_classes([AllowAny])
def google_login(request):
    serializer = GoogleLoginSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=400)

    data = serializer.validated_data
    email = data['email']
    first_name = data['first_name']
    last_name = data['last_name']
    google_id = data['google_id']
    picture = data.get('picture', '')

    try:
        user = User.objects.get(email=email)
        user_info = UserInfo.objects.get(user=user)
        if user_info.profile_picture_url:
            picture = user_info.profile_picture_url
    except User.DoesNotExist:
        username_base = f"{first_name}.{last_name}".lower()
        username = generate_unique_username(username_base)
        user = User.objects.create(username=username, email=email,
                                   first_name=first_name, last_name=last_name)
        user_info = UserInfo.objects.create(user=user, profile_picture_url=picture)

    refresh = RefreshToken.for_user(user)
    return Response({
        'refresh': str(refresh),
        'access': str(refresh.access_token),
        'username': user.username,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'email': user.email,
        'picture': picture,
    })
    
# remove this before going live -- security flaw
def all_users_view(request):
    users = User.objects.all().values('id', 'username', 'email', 'date_joined')
    return JsonResponse(list(users), safe=False)
