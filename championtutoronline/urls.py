from django.conf.urls import patterns, include, url
#from django.contrib import admin
from core.views import *
from core.viewsajax import *
from core.viewssearch import *
from core.decorators import user_login_required

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'championtutoronline.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    #url(r'^admin/', include(admin.site.urls)),
    url(r'^$', HomePage.as_view(), name='home_page'),
    url(r'^login$',LoginView.as_view(),name='user_login'),
    url(r'^logout$',LogoutView.as_view(),name='user_logout'),
    url(r'^signup$',SignUpView.as_view(),name='sign_up'),
    url(r'^whiteboard$', user_login_required(WhiteboardView.as_view()), name='whiteboard'),
    url(r'^profile', ProfileView.as_view(), name='user_profile'),
    url(r'^ajax/login$', LoginAjaxView.as_view(), name='ajax_login'),
    url(r'^ajax/signup$', SignUpAjaxView.as_view(), name='ajax_signup'),
    url(r'^ajax/initsession$',VideoSessionTokens.as_view(), name='ajax_video_session_init'),
    url(r'^ajax/startsession$',VideoSessionStart.as_view(), name='ajax_video_session_start'),
    url(r'^ajax/drawing_board$', DrawingBoardAjaxView.as_view(), name='ajax_drawing_board'),
    url(r'^ajax/text_editor$', TextEditorAjaxView.as_view(), name='ajax_text_editor'),
    url(r'^ajax/code_editor$', CodeEditorAjaxView.as_view(), name='ajax_code_editor'),
    url(r'^ajax/search_user$', SearchUserByKeyword.as_view(), name='ajax_user_search'),
    url(r'^reset_password_confirm/(?P<uidb64>[0-9A-Za-z]+)-(?P<token>.+)/$', PasswordResetConfirmView.as_view(), name='reset_password_confirm'),
    url(r'^reset_password', ResetPasswordRequestView.as_view(), name="reset_password"),
)
