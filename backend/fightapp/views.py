from .models import UserInfo, EmailVerification
from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from datetime import timedelta
from backend.services import email_verification

# send email verification code
@api_view(['POST'])
def send_code(request):
    email = request.data.get('email')
    
    email_verification.create_and_send_verification(email)
    
    return Response({'message': f'Code has been sent to {email}'})
    
# Email verification
@api_view(['POST'])
@permission_classes([AllowAny])
def verify_email_code(request):
    email = request.data.get('email')
    input_code = request.data.get('code')
    
    try:
        verification = EmailVerification.objects.filter(
            email=email, code=input_code, is_used=False
        ).latest('created_at')
    except EmailVerification.DoesNotExist:
        return Response({'success': False, 'detail': 'Invalid or expired code'}, status=400)
    
    verification.delete()
    return Response({'success': True, 'detail': 'Email verified successfully'})
    
    

def generate_unique_username(base):
    username = base
    counter = 1
    while User.objects.filter(username=username).exists():
        username = f"{base}{counter}"
        counter += 1
    return username

# login/signup with google
@api_view(['POST'])
@permission_classes([AllowAny])
def google_login(request):
    email = request.data.get('email')
    first_name = request.data.get('first_name')
    last_name = request.data.get('last_name')
    google_id = request.data.get('google_id')
    picture = request.data.get('picture')

    if not email:
        return Response({'error': 'Email required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(email=email)
        user_info = UserInfo.objects.get(user=user)
        pic_url = user_info.profile_picture_url
        
        if pic_url:
            picture = pic_url
        
        
    except User.DoesNotExist:
        # Create new user
        username_base = f"{first_name}.{last_name}".lower()
        username = generate_unique_username(username_base)
        user = User.objects.create(
            username=username,
            email=email,
            first_name=first_name,
            last_name=last_name,
        )
        user.save()
        user_info = UserInfo.objects.create(
            profile_picture_url=picture,
        )
        user_info.save()
        
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
    
def all_users_view(request):
    users = User.objects.all().values('id', 'username', 'email', 'date_joined')
    return JsonResponse(list(users), safe=False)
