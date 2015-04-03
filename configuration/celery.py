from __future__ import absolute_import
BROKER_URL = 'django://' #read docs
CELERY_IMPORTS = ('core.tasks', )
from datetime import timedelta
