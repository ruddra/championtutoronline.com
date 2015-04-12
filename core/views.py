import datetime
from django.shortcuts import render, get_object_or_404, redirect
import time
from easy_thumbnails.files import get_thumbnailer
from championtutoronline.settings import DEFAULT_FROM_EMAIL
from core.emails import EmailClient
from core.models import ResetPasswordToken, ProfilePicture, Profile, Education
from forms import LoginForm,SignUpForm, PasswordResetRequestForm, SetPasswordForm, ProfilePictureForm, SubjectMajorUpdateForm, \
    EducationForm,MyAccountForm,PaymentMethodForm
from models import ChampUser
from django.http import HttpResponseRedirect
from django.core.urlresolvers import reverse
from django.utils.decorators import method_decorator
from common.decorators import user_login_required
from django.contrib.sessions.models import Session
from common.methods import check_login
from django.contrib.auth import get_user_model
from django.db.models.query_utils import Q
from django.views.generic import *
from django.contrib import messages
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from core.models import *
from pyetherpad.padutil import *
from pyetherpad.models import *
from common.views import *
import uuid
from payment.models import *


class ProtectedView(object):

    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        if request.method.lower() in self.http_method_names:
            handler = getattr(self, request.method.lower(), self.http_method_not_allowed)
        else:
            handler = self.http_method_not_allowed
        return handler(request, *args, **kwargs)

class LoginView(View):
    def get(self,request,*args,**kwargs):
        if check_login(request):
            return HttpResponseRedirect(reverse("home_page"))
        login_form = LoginForm()
        error_msg = 'Status Error Message'
        next_page = request.GET.get("next")
        return render(request, 'login.html', {'title':'Login - Championtutor Online','form':login_form, 'error_msg':error_msg,'error':False,'next':next_page})
    def post(self,request,*args,**kwargs):
        login_form = LoginForm(request.POST)
        if not login_form.is_valid():
            return HttpResponseRedirect(reverse("user_login"))
        if login_form.is_valid():
            if login_form.authenticate(request):
                    request.session['is_login'] = True
                    redirect_url = reverse("user_profile", args=ChampUser.objects.get(user=request.user).id)
                    if request.POST.get("next"):
                        redirect_url = request.POST["next"]
        return HttpResponseRedirect(redirect_url)

        if not user_objs:
            login_form = LoginForm(request.POST)
            error_msg = 'Email or Password Invalid'
            return render(request, 'login.html', {'title':'Login - Championtutor Online','form':login_form,'error_msg':error_msg,'error':True})
            ###Passed login. Now set session
        request.session['is_login'] = True
        request.session['user_id'] = user_objs[0].id
        request.session['email'] = email
        request.session['utype'] = user_objs[0].type
        if request.POST.get("rememberme"):
            seven_days = 24*60*60*7
            request.session.set_expiry(seven_days)
        redirect_url = reverse("user_profile")
        if request.POST.get("next"):
            redirect_url = request.POST["next"]
        return HttpResponseRedirect(redirect_url)

class LogoutView(View):
    def get(self,request,*args,**kwargs):
        #Get the user session object.
        session_objs = Session.objects.filter(session_key=request.session.session_key)
        if session_objs:
            session_objs[0].delete()
        return HttpResponseRedirect(reverse("home_page"))

class SignUpView(View):
    def get(self,request,*args,**kwargs):
        signup_form = SignUpForm()
        return render(request,"registration.html",{'form':signup_form})

class MyAccountView(BaseView):

    @method_decorator(user_login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(self.__class__, self).dispatch(request, *args, **kwargs)

    def get(self,request,*args,**kwargs):
        data = {"email":request.user.email}
        ma_form = MyAccountForm(data)
        pm_form = PaymentMethodForm()

        payments_methods = PaymentMethod.objects.filter(user=request.user)

        context_data = { "ma_form": ma_form, "pm_form": pm_form, "payments_methods":payments_methods, "champ_user": ChampUser.objects.get(user_id=request.user.id) }
        return render(request,"my_account.html",context_data)

class HomePage(View):
    def get(self, request):
        if request.session.get('is_login'):
            return HttpResponseRedirect(reverse("user_profile", args= str(ChampUser.objects.get(user=request.user).id)))
        return render(request, 'index.html', {'title':'Championtutor Online'})

class WhiteboardView(View):

    @method_decorator(user_login_required)
    def dispatch(self, request, *args, **kwargs):
       return super(self.__class__, self).dispatch(request, *args, **kwargs)

    def get_context_data(self,request):
        data = {}
        _this_user_id = request.user.id
        user_objs = ChampUser.objects.filter(user__id=_this_user_id)
        if user_objs:
            user_obj = user_objs[0]
            #data["utype"] = user_obj.type

            query = None

            if user_obj.type == "student":
                #query to get teachers with recent chat and also teachers who initiated a chat with this student.
                query = "select * from champ_user where type='teacher' and user_id != '%s'" % _this_user_id
            else:
                #query to get students with recent chat and also students who initiated a chat with this teacher.
                query = "select * from champ_user where type='student' and user_id != '%s'" % _this_user_id

            if query:
                data["buddies"] = User.objects.raw(query)

        return data


    def get(self,request,*args,**kwargs):
        #c = RequestContext(request)
        #teachers = User.objects.raw("select * from champ_user where id != '%s'" % request.session.get("user_id"))
        ###Create a whiteboard for this user.

        whiteboard_objs = Whiteboard.objects.filter(user=request.user)
        if whiteboard_objs:
            whiteboard_obj = Whiteboard()
            whiteboard_obj.user = request.user
            whiteboard_obj.name = str(request.user.id) + str(uuid.uuid4())
            whiteboard_obj.created_date = datetime.now()
            whiteboard_obj.active = 1
            whiteboard_obj.save()

            drawing_board = DrawingBoard()
            drawing_board.whiteboard = whiteboard_obj
            drawing_board.numeric_id = 1
            drawing_board.name = "Default Board"
            drawing_board.create_date = datetime.now()
            drawing_board.save()

            ###Create Pad Author and group.
            # pad_util = PadUtil()
            # champ_user_obj = ChampUser.objects.get(user_id=request.user.id)
            # pad_author_id = pad_util.create_or_get_padauthor(request.user.id,champ_user_obj.fullname)
            # print "Pad Author Created. Author ID: "+pad_author_id
            #
            # pad_group_id = pad_util.create_or_get_padgroup(request.user.id)
            # print "Pad Group Created. Pad Group ID: "+pad_group_id
            #
            # pad_id = pad_util.create_group_pad(pad_group_id,str(request.user.id)+""+str(uuid.uuid4()))

            ###This is for testing purpose. All pads are made public now.
            ##pad_util.make_pad_public(pad_id)
            ppads = PublicPad.objects.filter(pad_nid=1)
            if not ppads:

                pad_util = PadUtil()
                pad_id = pad_util.create_public_pad(1)

                public_pad = PublicPad()
                public_pad.pad_nid = 1
                public_pad.pad_created_by = request.user
                public_pad.pad_create_date = datetime.now()
                public_pad.save()

        context_data = self.get_context_data(request)

        # pad_group = PadGroup.objects.get(user=request.user)
        # pads = Pad.objects.filter(pad_group=pad_group)

        pads = PublicPad.objects.all()

        context_data["text_pads"] = pads

        context_data["champ_user"] = ChampUser.objects.get(user_id=request.user.id)

        context_data["champ_userid"] = request.user.id
        return render(request, 'whiteboard.html', context_data)

class ProfileView(DetailView):
    model = ChampUser
    template_name = 'tutor_profile.html'

    def get_template_names(self):
        if self.object.type == 'teacher':
            return self.template_name
        else:
            return 'student_profile.html'

    def get_context_data(self, **kwargs):
        context = super(ProfileView, self).get_context_data(**kwargs)
        context['thumbnail_url'] = get_thumbnailer(self.object.profile_picture.image_field).get_thumbnail({
                        'size': (129, 129),
                        'box': self.object.profile_picture.cropping,
                        'crop': True,
                        'detail': True,
                    }).url if self.object.profile_picture else ''
        if Profile.objects.filter(user=self.object.user).exists():
            context['profile'] = Profile.objects.filter(user=self.object).first()
        else:
             context['profile'] = Profile.objects.create(user=self.object)

        context["champ_user"] = ChampUser.objects.get(user_id=self.object.user.pk)

        context['content_editable'] = True if self.object.user.id == self.request.user.id else False
        return context



class ChangeProfilePictureView(ProtectedView, FormView):
    template_name = "change_profile_picture.html"
    success_url = '/'
    form_class = ProfilePictureForm

    def get_success_url(self):
        return reverse('user_profile', args=str(ChampUser.objects.get(user=self.request.user).id))

    def get(self, request, image_id=None, *args, **kwargs):
        image = get_object_or_404(ProfilePicture, pk=image_id) if image_id else None
        form_class = self.get_form_class()
        form = form_class(instance=image)
        self.object = None
        return self.render_to_response(self.get_context_data(form=form))

    def post(self, request, image_id=None, *args, **kwargs):
        image = get_object_or_404(ProfilePicture, pk=image_id) if image_id else None
        form = self.form_class(request.POST, request.FILES, instance=image)
        if form.is_valid():
            if not image:
                image = form.save()
                return HttpResponseRedirect(reverse('crop_pp', args=(image.pk,)))
            else:
                image = form.save()
                if request.user.is_authenticated():
                    users = ChampUser.objects.filter(user=request.user)
                    if users.exists():
                        user = users[0]
                        user.profile_picture = image
                        user.save()
                return redirect(self.get_success_url())
        else:
            return self.form_invalid(form)


class ResetPasswordRequestView(FormView):
    template_name = "reset_password.html"
    success_url = '/'
    form_class = PasswordResetRequestForm

    def post(self, request, *args, **kwargs):
        form = self.form_class(request.POST)
        try:
            if form.is_valid():
                data = form.cleaned_data["email_or_username"]
                associated_users = User.objects.filter(Q(email=data) | Q(username=data))
                if associated_users.exists():
                    for user in associated_users:
                        import hashlib
                        token = hashlib.sha224(str(time.time()*1000)+user.username).hexdigest()
                        ResetPasswordToken.objects.create(token=token,user_id=user.id)
                        c = {
                            'email': 'ruddra90@gmail.com',
                            'domain': request.META['HTTP_HOST'],
                            'site_name': 'championtutoronline.com',
                            'uid': '',
                            'user': user,
                            'token': token,
                            'protocol': 'http',
                            }
                        email_template_name='registration/password_reset_email.html'
                        subject = "Password Reset"
                        subject = ''.join(subject.splitlines())
                        email = '<p>This email has been sent to you because you requested a password reset for your user account at {0}.<br/>' \
                        "Please go to the following page and choose a new password:<br\>"\
                        "<a href='{0}{1}>LINK</a>"\
                         "Your username, in case you've forgotten:{2}".format(c['domain'], '', c['user'].username)

                        print(reverse("reset_password_confirm",kwargs={'token': c['token']}))
                        EmailClient().send_email(user.email, subject, email, email, DEFAULT_FROM_EMAIL)
                    messages.success(request, 'An email has been sent to ' + data +". Please check its inbox to continue reseting password.")
                    return self.form_valid(form)
                else:
                    messages.error(request, 'No user is associated with this email address')
                    return self.form_invalid(form)
            messages.error(request, 'Invalid Input')
            return self.form_invalid(form)
        except Exception as e:
            print(e)
        

class PasswordResetConfirmView(FormView):
    template_name = "registration/password_change_form.html"
    success_url = '/'
    form_class = SetPasswordForm

    def post(self, request, token=None, *arg, **kwargs):
        """
        View that checks the hash in a password reset link and presents a
        form for entering a new password.
        """
        UserModel = get_user_model()
        form = self.form_class(request.POST)
        if ResetPasswordToken.objects.filter(token=token).exists():
            r_token = ResetPasswordToken.objects.get(token=token)
            user = r_token.user
            if r_token.date_created + datetime.timedelta(days=3) <= datetime.datetime.now():
                if form.is_valid():
                    new_password= form.cleaned_data['new_password2']
                    user.set_password(new_password)
                    user.save()
                    messages.success(request, 'Password has been reset.')
                    return self.form_valid(form)
                else:
                    messages.error(request, 'Password reset has not been unsuccessful.')
                    return self.form_invalid(form)

        messages.error(request,'The reset password link is no longer valid.')
        return self.form_invalid(form)

class ProtectedFormView(ProtectedView, FormView):
    template_name = 'create.html'

    def get_success_url(self):
        return reverse('user_profile', args=str(ChampUser.objects.get(user=self.request.user).id))

    def post(self, request, *args, **kwargs):
        form = self.form_class(request.POST)
        if form.is_valid():
            form.save(request)
            return self.form_valid(form)
        else:
            messages.error(request, 'Error occurred')
            return self.form_invalid(form)

class EducationAddView(ProtectedView,FormView):
    form_class = EducationForm
    template_name = 'create.html'

    def get_success_url(self):
        return reverse('user_profile', args=str(ChampUser.objects.get(user=self.request.user).id))

    def post(self, request, *args, **kwargs):
        form = self.form_class(request.POST)
        if form.is_valid():
            instance = form.save()
            profile = Profile.objects.get(user__user=request.user)
            profile.education.add(instance)
            return self.form_valid(form)
        else:
            messages.error(request, 'Error occurred')
            return self.form_invalid(form)

class EducationUpdateView(ProtectedView, UpdateView):
    model = Education
    template_name = 'create.html'

class EducationDeleteView(ProtectedView, DeleteView):
    model = Education

    def get_success_url(self):
        return reverse('user_profile', args=str(ChampUser.objects.get(user=self.request.user).id))

    def get(self, request, *args, **kwargs):
        return self.delete(request, *args, **kwargs)