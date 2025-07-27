from django.urls import path
from django.conf import settings
from . import views
from .views import google_login, all_users_view, verify_email_code, send_code, request_profile_upload_url
urlpatterns = [
    path('api/auth/google-login/', google_login, name='google_login'),
    path('api/auth/send-code/', send_code, name='send_code'),
    path('api/auth/email-verification/', verify_email_code, name='email_verification'),
    path('api/upload/profile-pic/', request_profile_upload_url, name='request_profile_upload_url'),
    path('api/users/', all_users_view, name='all_users')
]