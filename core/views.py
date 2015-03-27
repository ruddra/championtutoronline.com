from django.http import HttpResponse
from django.views.generic.base import View
from django.shortcuts import render
from forms import LoginForm,SignUpForm
import time
import hashlib
from models import User
import json
from django.http import HttpResponseRedirect
from django.template import RequestContext
from django.core.urlresolvers import reverse
from django.utils.decorators import method_decorator
from common.decorators import user_login_required
from django.contrib.sessions.models import Session
from common.methods import check_login

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

