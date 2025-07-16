# utils/email.py
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from decouple import config

def send_sendgrid_email(subject, message, to_email):
    email = Mail(
        from_email=config('DEFAULT_FROM_EMAIL'),
        to_emails=to_email,
        subject=subject,
        plain_text_content=message
    )
    try:
        sg = SendGridAPIClient(config('SENDGRID_API_KEY'))
        response = sg.send(email)
        print(f"✅ Status Code: {response.status_code}")
        return response.status_code == 202
    except Exception as e:
        print(f"❌ Error sending email: {e}")
        return False
