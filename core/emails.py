__author__ = 'Codengine'

import sendgrid
from django.conf import settings

class EmailClient:
    def __init__(self):
        print("Inside Email Sender Class.")

    @classmethod
    def send_email(cls, email_to, email_sub, html_body, text_body, from_email):
        try:
            sendgrid_client = sendgrid.SendGridClient(settings.SENDGRID_USERNAME, settings.SENDGRID_PASSWORD)
            message = sendgrid.Mail(to=email_to, subject=email_sub, html=html_body, text=text_body, from_email=from_email)
            status, msg = sendgrid_client.send(message)
            return status
        except Exception as msg:
            return False
