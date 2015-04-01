from __future__ import absolute_import
BROKER_URL = 'django://' #read docs
CELERY_IMPORTS = ('app1.tasks', )
from datetime import timedelta

CELERYBEAT_SCHEDULE = {
    'schedule-name': { 
                        'task': 'app1.tasks.email_sending_method',  # We are going to create a email_sending_method later in this post.
                        'schedule': timedelta(seconds=30),
                        },
    }