from django.conf.urls import patterns, include, url
#from django.contrib import admin
from core.views import *

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'championtutoronline.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    #url(r'^admin/', include(admin.site.urls)),
    url(r'^$', HomePage.as_view(), name='home_page'),
)
