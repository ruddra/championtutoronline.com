__author__ = 'Codengine'

from django.views.generic.base import View
from django.shortcuts import render
from django.http import HttpResponse
from forms import SignUpForm,LoginForm,MyAccountForm
from models import *
import json
import hashlib
from emails import EmailClient
import otlib
import json
from django.conf import settings
from django.contrib.auth.models import User
import uuid
from datetime import datetime
from pyetherpad.padutil import *
from core.models import *
from django.contrib.auth import authenticate

class DrawingBoardAjaxView(View):
    def get(self,request,*args,**kwargs):
        if request.is_ajax():

            context_data = {}
            drawingboards = []

            user_whiteboards = Whiteboard.objects.filter(user=request.user)
            if user_whiteboards:
                user_whiteboard = user_whiteboards[0]
                drawingboards = DrawingBoard.objects.filter(whiteboard=user_whiteboard)

            context_data["drawingboards"] = drawingboards

            return render(request,"ajax/drawingboard.html",context_data)
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
            if not login_form.authenticate(request):
                response = {'status':'unsuccessful','message':'Email or Password Invalid.'}
                return HttpResponse(json.dumps(response))
        ###Passed login. Now set session
        request.session['is_login'] = True
        request.session['user_id'] = request.user.id
        request.session['email'] = request.user.email
        #request.session['utype'] = request.user.type

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
        try:

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
            user_objs = ChampUser.objects.filter(user__email=email)
            if user_objs:
                response['message'] = 'EMAIL_REGISTERED'
                return HttpResponse(json.dumps(response))
            user_obj = ChampUser()
            user_obj.fullname = name

            auth_user = User.objects.create_user(username=email, email=email, password=password)
            user_obj.user = auth_user
            user_obj.type = role
            user_obj.save()
            response['status'] = 'successful'
            response['message'] = 'Successful.'

            email_sender_obj = EmailClient()
            email_sender_obj.send_email(email,"Registration Verification","Thank you for registering championtutoronline.com","Thank you for registering championtutoronline.com","codenginebd@gmail.com")
            return HttpResponse(json.dumps(response))
        except Exception,msg:
            response['status'] = 'Unsuccessful.'
            response['message'] = 'Exception occured. Message: %s' % str(msg)
            return HttpResponse(json.dumps(response))

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

class WhiteboardAjaxView(View):
    def get(self,request,*args,**kwargs):
        response = {
            "STATUS": "",
            "MESSAGE": ""
        }
        if request.is_ajax():
            ###Get current user's whiteboard instance.
            whiteboard_objs = Whiteboard.objects.filter(user=request.user)
            if whiteboard_objs:
                whiteboard_obj = whiteboard_objs[0]
                action = request.GET.get("action")
                if action == "ADD_DRAWING_BOARD":
                    ###Get the last numeric id.
                    drawingboard_obj = DrawingBoard.objects.filter(whiteboard=whiteboard_obj).order_by('-numeric_id')[0]
                    max_nid = drawingboard_obj.numeric_id
                    nid_new = max_nid + 1

                    name = request.GET.get("name")

                    if not name:
                        name = "New Board"

                    drawing_board = DrawingBoard()
                    drawing_board.whiteboard = whiteboard_obj
                    drawing_board.numeric_id = nid_new
                    drawing_board.name = name
                    drawing_board.create_date = datetime.now()
                    drawing_board.save()

                    response["STATUS"] = "SUCCESS"
                    response["MESSAGE"] = "Successful."
                    response["data"] = {"tab_count": nid_new}
                    return HttpResponse(json.dumps(response))
                elif action == "UPDATE_DRAWING_BOARD":
                    ###Get the last numeric id.
                    dboard_id = request.GET.get("dbid")
                    if not dboard_id:
                        response["STATUS"] = "FAILURE"
                        response["MESSAGE"] = "id must be given."
                        return HttpResponse(json.dumps(response))

                    try:
                        dboard_id = int(dboard_id)
                    except Exception,msg:
                        print "Exception occured while parsing id."
                        response["STATUS"] = "FAILURE"
                        response["MESSAGE"] = "id must be numeric."
                        return HttpResponse(json.dumps(response))

                    name = request.GET.get("name")
                    if not name:
                        response["STATUS"] = "FAILURE"
                        response["MESSAGE"] = "Name must be given."
                        return HttpResponse(json.dumps(response))

                    drawingboard_obj = DrawingBoard.objects.get(id=dboard_id)
                    drawingboard_obj.name = name
                    drawingboard_obj.save()

                    response["STATUS"] = "SUCCESS"
                    response["MESSAGE"] = "Successful."
                    return HttpResponse(json.dumps(response))
                elif action == "ADD_NEW_TEXT_PAD":
                    # pad_name = request.GET.get("name")
                    # if not pad_name:
                    #     pad_name = "New Pad"
                    # pad_util = PadUtil()
                    # pad_group_id = pad_util.create_or_get_padgroup(request.user.id)
                    # pad_id = pad_util.create_group_pad(pad_group_id,pad_name)
                    # response["STATUS"] = "SUCCESS"
                    # response["MESSAGE"] = "Successful."
                    # response["data"] = {"PAD_ID": pad_id}
                    # return HttpResponse(json.dumps(response))

                    ppad_obj = PublicPad.objects.all().order_by('-pad_nid')[0]
                    max_nid = ppad_obj.pad_nid
                    nid_new = max_nid + 1

                    pad_util = PadUtil()
                    pad_id = pad_util.create_public_pad(nid_new)

                    public_pad = PublicPad()
                    public_pad.pad_nid = nid_new
                    public_pad.pad_created_by = request.user
                    public_pad.pad_create_date = datetime.now()
                    public_pad.save()

                    response["STATUS"] = "SUCCESS"
                    response["MESSAGE"] = "Successful."
                    response["data"] = {"pad_count": nid_new,"id": public_pad.id}
                    return HttpResponse(json.dumps(response))

                elif action == "EDIT_TEXT_PAD":
                    pad_name = request.GET.get("name")
                    if not pad_name:
                        pad_name = "New Pad"
                    pad_id = request.GET.get("pad_id")
                    if not pad_id:
                        response["STATUS"] = "FAILURE"
                        response["MESSAGE"] = "Pad ID required."
                        return HttpResponse(json.dumps(response))
                    pad_util = PadUtil()
                    op_mode = pad_util.rename_group_pad(pad_id,pad_name)
                    if op_mode is True:
                        response["STATUS"] = "SUCCESS"
                        response["MESSAGE"] = "Successful."
                        return HttpResponse(json.dumps(response))
                    else:
                        response["STATUS"] = "FAILURE"
                        response["MESSAGE"] = "Pad ID doesn't exists."
                        return HttpResponse(json.dumps(response))
                else:
                    response["STATUS"] = "FAILURE"
                    response["MESSAGE"] = "Invalid operation specified."
                    return HttpResponse(json.dumps(response))
            else:
                response["STATUS"] = "FAILURE"
                response["MESSAGE"] = "No whiteboard instances found!"
                return HttpResponse(json.dumps(response))

        else:
            response["STATUS"] = "FAILURE"
            response["MESSAGE"] = "Invalid Operation."
            return HttpResponse(json.dumps(response))

class MyAccountAjaxView(View):
    def get(self,request,*args,**kwargs):
        return HttpResponse("Invalid")
    def post(self,request,*args,**kwargs):
        response = {
            "STATUS": "",
            "MESSAGE": ""
        }
        if request.is_ajax():
            form = MyAccountForm(request.POST)
            if form.is_valid():
                email = form.cleaned_data["email"]
                old_password = form.cleaned_data["old_password"]
                new_password = form.cleaned_data["new_password"]
                new_password_again = form.cleaned_data["new_password_again"]
                user = authenticate(username=email, password=old_password)
                if user:
                    user = User.objects.get(username=email)
                    if new_password == new_password_again:
                        print "Match"
                        user.set_password(new_password)
                        user.save()
                        print "Lol"
                        response["STATUS"] = "SUCCESS"
                        response["MESSAGE"] = "Account updated successfully."
                        return HttpResponse(json.dumps(response))
                    else:
                        response["STATUS"] = "FAILURE"
                        response["MESSAGE"] = "New password mismatch. Please type your new password carefully."
                        return HttpResponse(json.dumps(response))
                else:
                    response["STATUS"] = "FAILURE"
                    response["MESSAGE"] = "User authentication failed. Please specify your old password correctly."
                    return HttpResponse(json.dumps(response))
            else:
                response["STATUS"] = "FAILURE"
                response["MESSAGE"] = "Please fill up the form correctly."
                return HttpResponse(json.dumps(response))
        else:
            response["STATUS"] = "FAILURE"
            response["MESSAGE"] = "Invalid operation"
            return HttpResponse(json.dumps(response))



