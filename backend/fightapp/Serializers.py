from rest_framework import serializers
from .models import UserInfo

class EmailSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=255)
    
class EmailVerificationSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=255)
    code = serializers.CharField(min_length=6, max_length=6)
    
class GoogleLoginSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=255)
    first_name = serializers.CharField(max_length=50)
    last_name = serializers.CharField(max_length=50)
    google_id = serializers.CharField(max_length=100)
    picture = serializers.URLField(required=False, allow_blank=True)
    
class UserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserInfo
        fields = [
            'profile_picture_url',
            'discipline_primary',
            'discipline_secondary',
            'location',
            'latitude',
            'longitude',
            'height_in',
            'weight_lbs',
            'reach_in',
            'weight_class',
            'date_of_birth',
            'gender',
            'phone_number',
            'nickname',
        ]
