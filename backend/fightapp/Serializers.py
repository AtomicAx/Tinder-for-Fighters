from rest_framework import serializers

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