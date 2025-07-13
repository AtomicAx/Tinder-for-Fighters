from django.urls import path
from django.conf import settings
from . import views
from .views import google_login, all_users_view
urlpatterns = [
    path('api/auth/google-login/', google_login),
    path('api/users/', all_users_view, name='all_users')
]