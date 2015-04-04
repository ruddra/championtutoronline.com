from django.http import HttpResponse
from django.views.generic.base import View
from django.utils.encoding import smart_unicode
from django.shortcuts import render
from championtutoronline.settings import DEFAULT_MAIL_SENDER, DEFAULT_FROM_EMAIL
from core.tasks import email_sending_method
from forms import LoginForm,SignUpForm, PasswordResetRequestForm, SetPasswordForm
import time
import hashlib
from models import ChampUser
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
        if login_form.is_valid():
            if login_form.authenticate(request):
                    request.session['is_login'] = True
                    # request.session['user_id'] = user_objs[0].id
                    # request.session['email'] = email
                    # request.session['utype'] = user_objs[0].type
                    # if request.POST.get("rememberme"):
                    #     seven_days = 24*60*60*7
                    #     request.session.set_expiry(seven_days)
                    redirect_url = reverse("user_profile")
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
        context_data = self.get_context_data(request)
        context_data["champ_userid"] = request.user.id
        return render(request, 'whiteboard.html', context_data)

class ProfileView(View):
    def get(self,request,*args,**kwargs):
        template_name = "tutor_profile.html"
        _this_user_id = request.user.id
        user_objs = ChampUser.objects.filter(user__id=_this_user_id)
        print user_objs
        if user_objs:
            user_obj = user_objs[0]
            if user_obj.type == 'student':
                template_name = 'student_profile.html'
        return render(request,template_name,{})




class ResetPasswordRequestView(FormView):
    template_name = "reset_password.html"    #code for template is given below the view's code
    success_url = '/profile'
    form_class = PasswordResetRequestForm

    def post(self, request, *args, **kwargs):
        form = self.form_class(request.POST)
        try:
            if form.is_valid():
                data= form.cleaned_data["email_or_username"]
                associated_users= User.objects.filter(Q(email=data)|Q(username=data))
                if associated_users.exists():
                    for user in associated_users:
                            c = {
                                'email': user.email,
                                'domain': request.META['HTTP_HOST'],
                                'site_name': 'championtutoronline.com',
                                'uid': urlsafe_base64_encode(force_bytes(user.pk)),
                                'user': user,
                                'token': default_token_generator.make_token(user),
                                'protocol': 'http',
                                }
                            subject_template_name='registration/password_reset_subject.txt'
                            email_template_name='registration/password_reset_email.html'
                            subject = "Password Reset" #loader.render_to_string(subject_template_name, c)
                            subject = ''.join(subject.splitlines())
                            email = loader.render_to_string(email_template_name, c)
                            send_mail(subject, email, DEFAULT_FROM_EMAIL , [user.email], fail_silently=False)
                            #email_sending_method.apply_async(str(user.email), subject, email, DEFAULT_MAIL_SENDER)
                            # ^^ Reason for not using celery for now because I don't have rabbitmq in my windows machine.
                    messages.success(request, 'An email has been sent to ' + data +". Please check its inbox to continue reseting password.")
                    return self.form_valid(form)
                else:
                    messages.error(request, 'No user is associated with this email address')
                    return self.form_invalid(form)
            messages.error(request, 'Invalid Input')
            return self.form_invalid(form)
        except Exception as e:
            print e
        

class PasswordResetConfirmView(FormView):
    template_name = "account/test_template.html"
    success_url = '/'
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


