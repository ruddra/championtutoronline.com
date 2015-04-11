from django.conf.urls import patterns, url, include
from django.contrib import admin
from core.views import *
from core.viewsajax import *
from core.viewssearch import *
from core.decorators import user_login_required
from forms import AboutMeUpdateForm
import pyetherpad
from django.conf.urls.static import static
from django.conf import settings
from django.contrib.auth.decorators import login_required
urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'championtutoronline.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
    url(r'^$', HomePage.as_view(), name='home_page'),
    url(r'^login$',LoginView.as_view(),name='user_login'),
    url(r'^logout$',LogoutView.as_view(),name='user_logout'),
    url(r'^signup$',SignUpView.as_view(),name='sign_up'),
    url(r'^whiteboard$', user_login_required(WhiteboardView.as_view()), name='whiteboard'),
    url(r'^profile/(?P<pk>[0-9]+)/', ProfileView.as_view(), name='user_profile'),
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
    url(r'^texteditor/', include('pyetherpad.urls')),
    url(r'^change_profile_picture/(?P<image_id>\d+)/$', ChangeProfilePictureView.as_view(), name="crop_pp"),
    url(r'^change_profile_picture/', ChangeProfilePictureView.as_view(), name="change_pp"),
    url(r'^change_major_subject/', ProtectedFormView.as_view(form_class=SubjectMajorUpdateForm), name="change_major"),
    url(r'^change_about_me/', ProtectedFormView.as_view(form_class=AboutMeUpdateForm), name="change_about_me"),
    url(r'^add_education/', EducationAddView.as_view(), name="add_education"),
    url(r'^update_education/(?P<pk>[0-9]+)/', EducationUpdateView.as_view(), name='update_education'),
    url(r'^delete_education/(?P<pk>[0-9]+)/', EducationDeleteView.as_view(), name='delete_education'),
    url(r'^update_profile/(?P<params>\w+)/', UpdateProfileView.as_view(), name='profile_update'),

    #url(r'^change_profile_picture/(?P<image_id>\d+)/$', login_required(ChangeProfilePictureView.as_view(), name="crop_pp"),
    #url(r'^change_profile_picture/', login_required(ChangeProfilePictureView.as_view()), name="change_pp"),


)+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
js_info_dict = {
    'packages': ('django.conf',),
}