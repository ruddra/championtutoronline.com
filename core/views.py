from django.http import HttpResponse
from django.views.generic.base import View
from django.shortcuts import render
from championtutoronline.settings import DEFAULT_MAIL_SENDER
from core.models import EmailQueue
from core.tasks import email_sending_method
from forms import LoginForm,SignUpForm, PasswordResetRequestForm, SetPasswordForm
import time
import hashlib
from models import ConsoleUser
import json
from django.http import HttpResponseRedirect
from django.template import RequestContext
from django.core.urlresolvers import reverse
from django.utils.decorators import method_decorator
from common.decorators import user_login_required
from django.contrib.sessions.models import Session
from common.methods import check_login
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.db.models.query_utils import Q
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.template import loader
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from django.core.mail import send_mail
from django.views.generic import *
from django.contrib import messages
from django.contrib.auth.models import User

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
        email = request.POST.get('email')
        password = request.POST.get('password')
        password_hash = hashlib.md5(password).hexdigest()
        user_objs = User.objects.filter(email=email,password=password_hash)
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

class HomePage(View):
    def get(self, request):
        if request.session.get('is_login'):
            return HttpResponseRedirect(reverse("user_profile"))
        return render(request, 'index.html', {'title':'Championtutor Online'})

class WhiteboardView(View):

    @method_decorator(user_login_required)
    def dispatch(self, request, *args, **kwargs):
       return super(self.__class__, self).dispatch(request, *args, **kwargs)

    def get_context_data(self,request):
        data = {}
        _this_user_id = request.session.get("user_id")
        user_objs = User.objects.filter(id=_this_user_id)
        if user_objs:
            user_obj = user_objs[0]
            data["utype"] = user_obj.type

            query = None

            if user_obj.type == "student":
                #query to get teachers with recent chat and also teachers who initiated a chat with this student.
                query = "select * from champ_user where type='teacher' and id != '%s'" % _this_user_id
            else:
                #query to get students with recent chat and also students who initiated a chat with this teacher.
                query = "select * from champ_user where type='student' and id != '%s'" % _this_user_id

            if query:
                data["buddies"] = User.objects.raw(query)

        return data


    def get(self,request,*args,**kwargs):
        #c = RequestContext(request)
        #teachers = User.objects.raw("select * from champ_user where id != '%s'" % request.session.get("user_id"))
        context_data = self.get_context_data(request)
        context_data["champ_userid"] = request.session.get("user_id")
        return render(request, 'whiteboard.html', context_data)

class ProfileView(View):
    def get(self,request,*args,**kwargs):
        template_name = "tutor_profile.html"
        
        if request.session.get('utype') == 'student':
            template_name = 'student_profile.html'
        return render(request,template_name,{})




class ResetPasswordRequestView(FormView):
    template_name = "account/test_template.html"    #code for template is given below the view's code
    success_url = '/account/login'
    form_class = PasswordResetRequestForm

    @staticmethod
    def validate_email_address(email):

        try:
            validate_email(email)
            return True
        except ValidationError:
            return False

    def post(self, request, *args, **kwargs):
        form = self.form_class(request.POST)
        try:
            if form.is_valid():
                data= form.cleaned_data["email_or_username"]
            if self.validate_email_address(data) is True:                 #uses the method written above
                '''
                If the input is an valid email address, then the following code will lookup for users associated with that email address. If found then an email will be sent to the address, else an error message will be printed on the screen.
                '''
                associated_users= User.objects.filter(Q(email=data)|Q(username=data))
                if associated_users.exists():
                    for user in associated_users:
                            c = {
                                'email': user.email,
                                'domain': request.META['HTTP_HOST'],
                                'site_name': 'your site',
                                'uid': urlsafe_base64_encode(force_bytes(user.pk)),
                                'user': user,
                                'token': default_token_generator.make_token(user),
                                'protocol': 'http',
                                }
                            subject_template_name = 'registration/password_reset_subject.txt'
                            email_template_name = 'registration/password_reset_email.html'
                            subject = loader.render_to_string(subject_template_name, c)
                            # Email subject *must not* contain newlines
                            subject = ''.join(subject.splitlines())
                            email = loader.render_to_string(email_template_name, c)
                            # send_mail(subject, email, DEFAULT_FROM_EMAIL , [user.email], fail_silently=False)
                            email_sending_method.apply_async(user.email, subject, email, DEFAULT_MAIL_SENDER)
                    result = self.form_valid(form)
                    messages.success(request, 'An email has been sent to ' + data +". Please check its inbox to continue reseting password.")
                    return result
                result = self.form_invalid(form)
                messages.error(request, 'No user is associated with this email address')
                return result
            else:
                '''
                If the input is an username, then the following code will lookup for users associated with that user. If found then an email will be sent to the user's address, else an error message will be printed on the screen.
                '''
                associated_users= User.objects.filter(username=data)
                if associated_users.exists():
                    for user in associated_users:
                        c = {
                            'email': user.email,
                            'domain': 'example.info',
                            'site_name': 'example',
                            'uid': urlsafe_base64_encode(force_bytes(user.pk)),
                            'user': user,
                            'token': default_token_generator.make_token(user),
                            'protocol': 'http',
                            }
                        subject_template_name='registration/password_reset_subject.txt'
                        email_template_name='registration/password_reset_email.html'
                        subject = loader.render_to_string(subject_template_name, c)
                        # Email subject *must not* contain newlines
                        subject = ''.join(subject.splitlines())
                        email = loader.render_to_string(email_template_name, c)
                        send_mail(subject, email, DEFAULT_FROM_EMAIL , [user.email], fail_silently=False)
                    result = self.form_valid(form)
                    messages.success(request, 'Email has been sent to ' + data +"'s email address. Please check its inbox to continue reseting password.")
                    return result
                result = self.form_invalid(form)
                messages.error(request, 'This username does not exist in the system.')
                return result
            messages.error(request, 'Invalid Input')
        except Exception as e:
            print(e)
        return self.form_invalid(form)

class PasswordResetConfirmView(FormView):
    template_name = "account/test_template.html"
    success_url = '/admin/'
    form_class = SetPasswordForm

    def post(self, request, uidb64=None, token=None, *arg, **kwargs):
        """
        View that checks the hash in a password reset link and presents a
        form for entering a new password.
        """
        UserModel = get_user_model()
        form = self.form_class(request.POST)
        assert uidb64 is not None and token is not None  # checked by URLconf
        try:
            uid = urlsafe_base64_decode(uidb64)
            user = UserModel._default_manager.get(pk=uid)
        except (TypeError, ValueError, OverflowError, UserModel.DoesNotExist):
            user = None

        if user is not None and default_token_generator.check_token(user, token):
            if form.is_valid():
                new_password= form.cleaned_data['new_password2']
                user.set_password(new_password)
                user.save()
                messages.success(request, 'Password has been reset.')
                return self.form_valid(form)
            else:
                messages.error(request, 'Password reset has not been unsuccessful.')
                return self.form_invalid(form)
        else:
            messages.error(request,'The reset password link is no longer valid.')
            return self.form_invalid(form)


