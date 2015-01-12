from django.conf.urls import patterns, include, url
#from django.contrib import admin
from core.views import *
from core.viewsajax import *

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'championtutoronline.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    #url(r'^admin/', include(admin.site.urls)),
    url(r'^$', HomePage.as_view(), name='home_page'),
    url(r'^login$',LoginView.as_view(),name='user_login'),
    url(r'^signup$',SignUpView.as_view(),name='sign_up'),
    url(r'^whiteboard$', WhiteboardView.as_view(), name='whiteboard'),
    url(r'^ajax/signup', DrawingBoardAjaxView.as_view(), name='ajax_drawing_board'),
    url(r'^ajax/drawing_board$', DrawingBoardAjaxView.as_view(), name='ajax_drawing_board'),
    url(r'^ajax/text_editor$', TextEditorAjaxView.as_view(), name='ajax_text_editor'),
    url(r'^ajax/code_editor$', CodeEditorAjaxView.as_view(), name='ajax_code_editor'),
)
