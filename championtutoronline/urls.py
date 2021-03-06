from django.conf.urls import patterns, include, url
#from django.contrib import admin
from core.views import *
from core.viewsajax import *
from core.viewssearch import *
from core.decorators import user_login_required
from django.conf.urls.static import static
from django.conf import settings
from django.contrib.auth.decorators import login_required
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
    url(r'^reset_password_confirm/(?P<token>.+)/$', PasswordResetConfirmView.as_view(), name='reset_password_confirm'),
    url(r'^reset_password', ResetPasswordRequestView.as_view(), name="reset_password"),
    url(r'^change_profile_picture/(?P<image_id>\d+)/$', ChangeProfilePictureView.as_view(), name="crop_pp"),
    url(r'^change_profile_picture/', ChangeProfilePictureView.as_view(), name="change_pp"),
    #url(r'^change_profile_picture/(?P<image_id>\d+)/$', login_required(ChangeProfilePictureView.as_view(), name="crop_pp"),
    #url(r'^change_profile_picture/', login_required(ChangeProfilePictureView.as_view()), name="change_pp"),


)+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
