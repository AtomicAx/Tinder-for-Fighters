import boto3
from django.conf import settings
import uuid

def generate_presigned_upload_url(user_id, content_type):
    s3 = boto3.client(
        's3',
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        region_name=settings.AWS_REGION_NAME,
    )
    
    file_extension = content_type.split('/')[-1]
    unique_filename = f"user_uploads/{user_id}/{uuid.uuid4()}.{file_extension}"
    
    presigned_url = s3.generate_presigned_url(
        'put_object',
        Params={
            'Bucket': settings.AWS_STORAGE_BUCKET_NAME,
            'Key': unique_filename,
            'ContentType': content_type,
            'ACL': 'private'
        },
        ExpiresIn=300 # 5 mins
    )
    
    return presigned_url, unique_filename