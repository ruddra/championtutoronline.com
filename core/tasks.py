from __future__ import absolute_import
import datetime
from celery.task.base import periodic_task
from championtutoronline.settings import DEFAULT_MAIL_SENDER
from core.emails import EmailClient
from celery import task


# @task(default_retry_delay=5, max_retries=12)
def email_sending_method(email_to, email_subject, email, default_mail_sender):
    try:
        EmailClient.send_email(email_to, email_subject, email, default_mail_sender)
    except Exception as e:
        print e