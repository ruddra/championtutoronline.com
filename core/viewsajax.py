__author__ = 'Codengine'

from django.views.generic.base import View
from django.shortcuts import render
from django.http import HttpResponse
from forms import SignUpForm,LoginForm
from models import *
import json
import hashlib

class DrawingBoardAjaxView(View):
    def get(self,request,*args,**kwargs):
        if request.is_ajax():
            return render(request,"ajax/drawingboard.html",{})
        else:
            return HttpResponse("Invalid Request")

class TextEditorAjaxView(View):
    def get(self,request,*args,**kwargs):
        if request.is_ajax():
            return render(request,"ajax/text_editor.html",{})
        else:
            return HttpResponse("Invalid Request")

class CodeEditorAjaxView(View):
    def get(self,request,*args,**kwargs):
        if request.is_ajax():
            return render(request,"ajax/code_editor.html",{})
        else:
            return HttpResponse("Invalid Request")

class LoginAjaxView(View):
    def get(self,request,*args,**kwargs):
        login_form = LoginForm()
        return render(request,"login.html",{'form':login_form})
    def post(self,request,*args,**kwargs):
        response = {'status':'unsuccessful','message':''}
        if not request.is_ajax():
            response = {'status':'unsuccessful','message':'Invalid Request.'}
            return HttpResponse(json.dumps(response))
        login_form = LoginForm(request.POST)
        if not login_form.is_valid():
            response = {'status':'unsuccessful','message':'Form contains invalid data.'}
            return HttpResponse(json.dumps(response))
        email = request.POST.get('email')
        password = request.POST.get('password')
        password_hash = hashlib.md5(password).hexdigest()
        user_objs = User.objects.filter(email=email,password=password_hash)
        if not user_objs:
            response = {'status':'unsuccessful','message':'Email or Password Invalid.'}
            return HttpResponse(json.dumps(response))
        ###Passed login. Now set session
        request.session['logged_in'] = True
        request.session['email'] = email
        response = {'status':'successful','message':'Login Successful.'}
        return HttpResponse(json.dumps(response))

class SignUpAjaxView(View):
    def get(self,request,*args,**kwargs):
        signup_form = SignUpForm()
        return render(request,"registration.html",{'form':signup_form})

    def post(self,request,*args,**kwargs):
        response = {'status':'unsuccessful','message':''}
        if not request.is_ajax():
            response = {'status':'unsuccessful','message':'Invalid Request.'}
            return HttpResponse(json.dumps(response))
        #try:

        signup_form = SignUpForm(request.POST)

        if not signup_form.is_valid():
            response = {'status':'unsuccessful','message':'Form contains invalid data.'}
            return HttpResponse(json.dumps(response))

        name = request.POST.get("name")
        email = request.POST.get("email")
        mobile = request.POST.get("mobile")
        password = request.POST.get("password")
        pass_repeat = request.POST.get("password_repeat")
        role = request.POST.get("role")

        ###Check if email is already registered.
        user_objs = User.objects.filter(email=email)
        if user_objs:
            response['message'] = 'Email already registered.'
            return HttpResponse(json.dumps(response))
        user_obj = User()
        user_obj.fullname = name
        user_obj.email = email
        user_obj.password = hashlib.md5(password).hexdigest()
        user_obj.phone = mobile
        user_obj.type = role
        user_obj.save()
        response['status'] = 'successful'
        response['message'] = 'Successful.'
        return HttpResponse(json.dumps(response))
        # except Exception,msg:
        #     response['status'] = 'Unsuccessful.'
        #     response['message'] = 'Exception occured. Message: %s' % str(msg)
        #     return HttpResponse(json.dumps(response))







