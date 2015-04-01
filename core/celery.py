from __future__ import absolute_import
import os
from celery import Celery
import django
from django.conf import settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'settings')
app = Celery('core.email_sending_method')
app.config_from_object('django.conf:settings')
app.autodiscover_tasks(lambda: settings.INSTALLED_APPS)

app.conf.update(
    CELERY_RESULT_BACKEND='djcelery.backends.database:DatabaseBackend',
    )
@app.task(bind=True)
def debug_task(self):
    print('Request: {0!r}'.format(self.request))