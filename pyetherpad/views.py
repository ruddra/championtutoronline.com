from django.shortcuts import render
from django.conf import settings
from django.views.generic.base import View
from py_etherpad import EtherpadLiteClient
from pyetherpad.models import *
from django.contrib.auth.models import User
from datetime import datetime
from datetime import timedelta
from core.models import *
from django.http import HttpResponse
import json
import time

# Create your views here.
class CreateGroupPad(View):
    def get(self,request,*args,**kwargs):
        if not request.is_ajax():
            response_data = {
                "ERROR": 1,
                "CAUSE": "AJAX_REQUIRED"
            }

            response =  HttpResponse(json.dumps(response_data), mimetype='application/json')
            return response
        if request.user.is_authenticated():
            pad_name = request.GET.get('pad_name')
            pad_util = PadUtil()
            pad_group_id = pad_util.create_or_get_padgroup(request.user.id)
            pad_id = pad_util.create_group_pad(pad_group_id,pad_name)
            champ_user_obj = ChampUser.objects.filter(user__id=request.user.id).first()
            response_data = {
                "pad_id": pad_id,
                "author_name": champ_user_obj.fullname
            }

            response =  HttpResponse(json.dumps(response_data), mimetype='application/json')

            def set_cookies_response(response,name,value,server_host=None,http_only=False):
                if server_host:
                    return response.set_cookie(
                        name,
                        value=value,
                        expires = datetime.utcnow() + timedelta(seconds=7*24*60*60),
                        domain=server_host,
                        httponly=http_only
                    )
                else:
                    return response.set_cookie(
                        name,
                        value=value,
                        expires = datetime.utcnow() + timedelta(seconds=7*24*60*60),
                        httponly=http_only
                    )

            if ('padSessionID' in request.COOKIES):

                onehour_ahead = datetime.now() + timedelta(hours=1)
                pad_session_objs = PadSession.objects.filter(session_id=request.COOKIES["padSessionID"],expired_time__lte=onehour_ahead)
                if pad_session_objs:
                    pad_session_objs.delete()
                    pad_util.delete_ep_session(request.COOKIES['sessionID'])
                    response.delete_cookie('sessionID', settings.SERVER_HOST)
                    response.delete_cookie('padSessionID')

                    author_id = pad_util.getPadAuthorIDFor(request.user.id)
                    group_id = pad_util.getPadGroupFor(request.user.id)
                    session_id = pad_util.create_session(group_id,author_id)

                    response = set_cookies_response(response,'sessionID',session_id,settings.SERVER_HOST)
                    response = set_cookies_response(response,'padSessionID',session_id)

            else:
                author_id = pad_util.getPadAuthorIDFor(request.user.id)
                group_id = pad_util.getPadGroupFor(request.user.id)
                session_id = pad_util.create_session(group_id,author_id)

                response = set_cookies_response(response,'sessionID',session_id,settings.SERVER_HOST)
                response = set_cookies_response(response,'padSessionID',session_id)

            # Set the new session cookie for both the server and the local site
            # response.set_cookie(
            #     'sessionID',
            #     value=result['sessionID'],
            #     expires=expires,
            #     domain=server.hostname,
            #     httponly=False
            # )
            # response.set_cookie(
            #     'padSessionID',
            #     value=result['sessionID'],
            #     expires=expires,
            #     httponly=False
            # )
            return response
        else:
            print "User is not authenticated."
            response_data = {
                "ERROR": 1,
                "CAUSE": "AUTHENTICATION_REQUIRED"
            }

            response =  HttpResponse(json.dumps(response_data), mimetype='application/json')
            return response

    def post(self,request,*args,**kwargs):
        pass

class SharePad(View):
    def get(self,request,*args,**kwargs):
        if not request.is_ajax():
            response_data = {
                "ERROR": 1,
                "CAUSE": "AJAX_REQUIRED"
            }

            response =  HttpResponse(json.dumps(response_data), mimetype='application/json')
            return response
        shared_users = request.GET.get("uids")
        shared_users = shared_users.split(",")
        pass

class DeletePad(View):
    def get(self,request,*args,**kwargs):
        if not request.is_ajax():
            response_data = {
                "ERROR": 1,
                "CAUSE": "AJAX_REQUIRED"
            }

            response =  HttpResponse(json.dumps(response_data), mimetype='application/json')
            return response
        if request.user.is_authenticated():
            if request.GET.get("pad_id"):
                pad_util = PadUtil()
                pad_util.delete_group_pad(request.GET["pad_id"])
                response_data = {
                    "STATUS": 0,
                    "MESSAGE": "Successful.",
                }
                response =  HttpResponse(json.dumps(response_data), mimetype='application/json')
                return response
            response_data = {
                "STATUS": 1,
                "MESSAGE": "Invaluid Pad ID.",
                }
            response =  HttpResponse(json.dumps(response_data), mimetype='application/json')
            return response
        else:
            response_data = {
                "STATUS": 1,
                "MESSAGE": "Authentication Required.",
                }
            response =  HttpResponse(json.dumps(response_data), mimetype='application/json')
            return response