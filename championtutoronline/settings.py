import os
from easy_thumbnails.conf import Settings as thumbnail_settings
BASE_DIR = os.path.dirname(os.path.dirname(__file__))

ENVIRONMENT = os.environ

DEBUG = bool(ENVIRONMENT.get('DEBUG', True))
TEMPLATE_DEBUG = DEBUG

ADMINS = (
    ('Max', ENVIRONMENT.get('EMAIL_USER')),
)

MANAGERS = ADMINS


# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.mysql',
#         'NAME': 'champ_db',
#         'USER': 'root',
#         'PASSWORD': '',
#         'HOST': '127.0.0.1',
#         'PORT': '',
#         }
# }


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}

# Local time zone for this installation. Choices can be found here:
# http://en.wikipedia.org/wiki/List_of_tz_zones_by_name
# although not all choices may be available on all operating systems.
# On Unix systems, a value of None will cause Django to use the same
# timezone as the operating system.
# If running in a Windows environment this must be set to the same as your
# system time zone.
TIME_ZONE = 'America/New_York'

# Language code for this installation. All choices can be found here:
# http://www.i18nguy.com/unicode/language-identifiers.html
LANGUAGE_CODE = 'en-us'

SITE_ID = 1

# If you set this to False, Django will make some optimizations so as not
# to load the internationalization machinery.
USE_I18N = True

# If you set this to False, Django will not format dates, numbers and
# calendars according to the current locale.
USE_L10N = True

# If you set this to False, Django will not use timezone-aware datetimes.
USE_TZ = True

# http://morethanseven.net/2009/02/11/django-settings-tip-setting-relative-paths.html
SITE_ROOT = os.path.dirname(os.path.realpath(__file__))

# Absolute filesystem path to the directory that will hold user-uploaded files.
# Example: "/home/media/media.lawrence.com/media/"
MEDIA_ROOT = os.path.join(SITE_ROOT, 'media')

# URL that handles the media served from MEDIA_ROOT. Make sure to use a
# trailing slash.
# Examples: "http://media.lawrence.com/media/", "http://example.com/media/"
MEDIA_URL = '/media/'

# Absolute path to the directory static files should be collected to.
# Don't put anything in this directory yourself; store your static files
# in apps' "static/" subdirectories and in STATICFILES_DIRS.
# Example: "/home/media/media.lawrence.com/static/"
STATIC_ROOT = os.path.join(SITE_ROOT, 'static')

# URL prefix for static files.
# Example: "http://media.lawrence.com/static/"
STATIC_URL = '/static/'

ADMIN_MEDIA_PREFIX = '/static/admin/'

# Additional locations of static files
STATICFILES_DIRS = (
    # Put strings here, like "/home/html/static" or "C:/www/django/static".
    # Always use forward slashes, even on Windows.
    # Don't forget to use absolute paths, not relative paths.
)

# List of finder classes that know how to find static files in
# various locations.
STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
#    'django.contrib.staticfiles.finders.DefaultStorageFinder',
)

# Make this unique, and don't share it with anybody.
SECRET_KEY = ENVIRONMENT.get('SECRET_KEY', 'a^&%6yp#2eudk%+5v-7tkhn+hxfm2_zmm83rpp&!oe7(n@-tta')

# List of callables that know how to import templates from various sources.
TEMPLATE_LOADERS = (
    'django.template.loaders.app_directories.Loader',
    'django.template.loaders.filesystem.Loader',
#     'django.template.loaders.eggs.Loader',
)

MIDDLEWARE_CLASSES = (
    #'django.middleware.cache.UpdateCacheMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    # Uncomment the next line for simple clickjacking protection:
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    #'debug_toolbar.middleware.DebugToolbarMiddleware',
    #'django.middleware.cache.FetchFromCacheMiddleware',
)

TEMPLATE_CONTEXT_PROCESSORS = (
    "django.contrib.auth.context_processors.auth",
    "django.core.context_processors.debug",
    "django.core.context_processors.i18n",
    "django.core.context_processors.media",
    "django.core.context_processors.static",
    "django.core.context_processors.tz",
    'django.core.context_processors.request',
    "django.contrib.messages.context_processors.messages"
    )

ROOT_URLCONF = 'championtutoronline.urls'

# Python dotted path to the WSGI application used by Django's runserver.
WSGI_APPLICATION = 'championtutoronline.wsgi.application'

SESSIONENGINE = 'django.contrib.sessions.backends.db'
SESSION_SERIALIZER = 'django.contrib.sessions.serializers.JSONSerializer'

TEMPLATE_DIRS = (
    # Put strings here, like "/home/html/django_templates" or "C:/www/django/templates".
    # Always use forward slashes, even on Windows.
    # Don't forget to use absolute paths, not relative paths.
    os.path.join(SITE_ROOT, 'templates'),
)

INSTALLED_APPS = (
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # Uncomment the next line to enable the admin:
    'django.contrib.admin',
    # Uncomment the next line to enable admin documentation:
    'django.contrib.admindocs',
    'django.contrib.humanize',
    'easy_thumbnails',
    'image_cropping',
    'core',
    'authentication',
    'common'
)

LOGIN_URL = '/login/'
LOGIN_REDIRECT_URL = '/'
LOGOUT_URL = '/logout/'

SOCKETIO_URL = 'http://127.0.0.1:3000/'

SENDGRID_SMTP = "smtp.sendgrid.net"
SENDGRID_USERNAME = "codenginebd"
SENDGRID_PASSWORD = "lapsso065CommlinkCommlink"

OT_API_KEY = 45178522
OT_API_SECRET = '5c202e71e6735a565e3b8f9c89e0952bacc34429'

COMMON_DATA_CONTEXT = {
    "socketio_url": SOCKETIO_URL
}

DEFAULT_MAIL_SENDER = DEFAULT_FROM_EMAIL = 'codenginebd@gmail.com'

THUMBNAIL_PROCESSORS = (
    'image_cropping.thumbnail_processors.crop_corners',
) + thumbnail_settings.THUMBNAIL_PROCESSORS