from __future__ import absolute_import
import datetime
from celery.task.base import periodic_task
from championtutoronline.settings import DEFAULT_MAIL_SENDER
from core.models import EmailQueue
from core.emails import EmailClient


@periodic_task(run_every=datetime.timedelta(seconds=30))
def email_sending_method():
    try:
        for email in EmailQueue.objects.filter(has_sent=False):
            EmailClient.send_email(email.to_email,email.subject, email.body. email.email, email.email, DEFAULT_MAIL_SENDER)
            email.has_sent = True
            email.save()
    except Exception as e:
        print e