__author__ = 'Codengine'

from django.views.generic.base import View
from django.shortcuts import render
from django.http import HttpResponse
from forms import SignUpForm,LoginForm
from models import *
import json
import hashlib
from emails import EmailClient
import otlib
import json
from django.conf import settings

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
        return render(request,"ajax/login.html",{'form':login_form})
    def post(self,request,*args,**kwargs):
        response = {'status':'unsuccessful','message':''}
        if not request.is_ajax():
            response = {'status':'unsuccessful','message':'Invalid Request.'}
            return HttpResponse(json.dumps(response))
        login_form = LoginForm(request.POST)
        if not login_form.is_valid():
            response = {'status':'unsuccessful','message':'Form contains invalid data.'}
            return HttpResponse(json.dumps(response))
        if login_form.is_valid():
            if login_form.authenticate(request):
                response = {'status':'unsuccessful','message':'Email or Password Invalid.'}
                return HttpResponse(json.dumps(response))
        ###Passed login. Now set session
        request.session['is_login'] = True
        request.session['user_id'] = user_objs[0].id
        request.session['email'] = email
        request.session['utype'] = user_objs[0].type

        response = {'status':'successful','message':'Login Successful.'}
        return HttpResponse(json.dumps(response))

class SignUpAjaxView(View):
    def get(self,request,*args,**kwargs):
        signup_form = SignUpForm()
        return render(request,"ajax/registration.html",{'form':signup_form})

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
        password = request.POST.get("password")
        pass_repeat = request.POST.get("password_repeat")
        role = request.POST.get("role")

        ###Check if email is already registered.
        user_objs = ConsoleUser.objects.filter(email=email)
        if user_objs:
            response['message'] = 'EMAIL_REGISTERED'
            return HttpResponse(json.dumps(response))
        user_obj = ConsoleUser()
        user_obj.fullname = name
        user_obj.email = email
        user_obj.password = hashlib.md5(password).hexdigest()
        user_obj.type = role
        user_obj.save()
        response['status'] = 'successful'
        response['message'] = 'Successful.'

        ###Now send email.
        #email_sender_obj = EmailClient()
        #email_sender_obj.send_email(email,"Registration Verification","Thank you for registering championtutoronline.com","Thank you for registering championtutoronline.com","codenginebd@gmail.com")

        return HttpResponse(json.dumps(response))
        # except Exception,msg:
        #     response['status'] = 'Unsuccessful.'
        #     response['message'] = 'Exception occured. Message: %s' % str(msg)
        #     return HttpResponse(json.dumps(response))

class VideoSessionTokens(View):
    def get(self,request,*args,**kwargs):
        ###Now read the ot session from ot_session table and then request a token id.
        #print request.GET.get("uids[]")
        uids = request.GET.get("uids")
        otsession = request.GET.get("ot_session")
        uids = uids.split(",")
        uids = [uid for uid in uids if uid]
        tokens = otlib.generate_ot_tokens(user_ids=uids,otsession=otsession)
        return HttpResponse(json.dumps(tokens), content_type="application/json")

class VideoSessionStart(View):
    def get(self,request,*args,**kwargs):
        api_key = settings.OT_API_KEY
        otsession = request.GET.get("_ots")
        token = request.GET.get("_token")
        data = {
            "OT_API_KEY": api_key,
            "OT_SESSION": otsession,
            "OT_TOKEN": token
        }
        return render(request,"ajax/videoframe.html",data)