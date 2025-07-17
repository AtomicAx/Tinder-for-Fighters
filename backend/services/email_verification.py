import random
from .models import EmailVerification
from backend.emails import send_sendgrid_email

def generate_verification_code():
    return str(random.randint(100000, 999999))

def create_and_send_verification(email):
    code = generate_verification_code()
    EmailVerification.objects.create(email=email, code=code)
    
    send_sendgrid_email(
        "Your Tinder for Fighters Verification Code",
        f"Your verification code is: {code}",
        email
    )