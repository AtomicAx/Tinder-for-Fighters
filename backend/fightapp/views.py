from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.response import Response
from django.http import JsonResponse
from .models import UserInfo
from django.contrib.auth.models import User
from rest_framework.decorators import permission_classes
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken

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
