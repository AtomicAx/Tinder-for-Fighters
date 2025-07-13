from django.urls import path
from django.conf import settings
from . import views
from .views import google_login
urlpatterns = [
    path('api/auth/google-login/', google_login),
]