from django.http import HttpResponse
from django.views.generic.base import View
from django.shortcuts import render
from forms import LoginForm,SignUpForm
import time
import hashlib
from models import User
import json
from django.http import HttpResponseRedirect
from django.core.urlresolvers import reverse
from django.utils.decorators import method_decorator
from core.decorators import user_login_required

class LoginView(View):
    def get(self,request,*args,**kwargs):
        login_form = LoginForm()
        return render(request, 'login.html', {'title':'Login - Championtutor Online','form':login_form})
    def post(self,request,*args,**kwargs):
        login_form = LoginForm(request.POST)
        if not login_form.is_valid():
            return HttpResponseRedirect(reverse("user_login"))
        email = request.POST.get('email')
        password = request.POST.get('password')
        password_hash = hashlib.md5(password).hexdigest()
        user_objs = User.objects.filter(email=email,password=password_hash)
        if not user_objs:
            response = {'status':'unsuccessful','message':'Email or Password Invalid.'}
            return HttpResponse(json.dumps(response))
            ###Passed login. Now set session
        request.session['is_login'] = True
        request.session['email'] = email
        request.session['utype'] = user_objs[0].type
        return HttpResponseRedirect(reverse("user_profile"))

class LogoutView(View):
    def get(self,request,*args,**kwargs):
        request.session = {}
        del request.session
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

    def get(self,request,*args,**kwargs):
        return render(request, 'whiteboard.html', {})

class ProfileView(View):
    def get(self,request,*args,**kwargs):
        template_name = "tutor_profile1_1.html"
        if request.session.get('utype') == 'student':
            template_name = 'student_profile.html'
            template_name = "tutor_profile1_1.html"
        return render(request,template_name,{})

