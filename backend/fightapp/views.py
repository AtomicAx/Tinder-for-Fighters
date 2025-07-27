from .models import UserInfo, EmailVerification
from .Serializers import EmailSerializer, EmailVerificationSerializer, GoogleLoginSerializer
from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from datetime import timedelta
from backend.services import email_verification
from backend.services.s3_utils import generate_presigned_upload_url

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
@api_view([IsAuthenticated])
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
