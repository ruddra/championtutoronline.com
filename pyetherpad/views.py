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

class PadUtil:
    def __init__(self):
        self.epclient = EtherpadLiteClient(settings.ETHERPAD_API_KEY, settings.ETHERPAD_API_URL)

    def create_or_get_padauthor(self,user_id,name):
        user_objs = User.objects.filter(id=user_id)
        if user_objs:
            user_obj = user_objs[0]
            pad_author_objs = PadAuthor.objects.filter(user=user_obj)
            if pad_author_objs:
                return pad_author_objs[0].author_id
            result = self.epclient.createAuthorIfNotExistsFor(user_id,name)
            #self.authorID = result['authorID']
            ###Now save user to database table.
            pad_author = PadAuthor()
            pad_author.user = user_obj
            pad_author.author_id = result['authorID']
            pad_author.created_on = datetime.now()
            pad_author.save()
            return result['authorID']

    def create_or_get_padgroup(self,user_id):
        user_objs = User.objects.filter(id=user_id)
        if user_objs:
            user_obj = user_objs[0]
            pad_group_objs = PadGroup.objects.filter(user=user_obj)
            if pad_group_objs:
                return pad_group_objs[0].group_id
            result = self.epclient.createGroupIfNotExistsFor(user_id)
            #self.authorID = result['authorID']
            ###Now save user to database table.
            pad_group = PadGroup()
            pad_group.user = user_obj
            pad_group.group_id = result['groupID']
            pad_group.group_created_on = datetime.now()
            pad_group.save()
            return result['groupID']

    def create_group_pad(self,pad_group_id,pad_name,text=''):
        result = self.epclient.createGroupPad(pad_group_id,pad_name,text)
        pad_obj = Pad()
        pad_obj.pad_id = result['padID']
        pad_group_obj = PadGroup.objects.filter(group_id=pad_group_id).first()
        pad_obj.pad_group = pad_group_obj
        pad_obj.pad_name = pad_name
        pad_obj.pad_created_by = pad_group_obj.user
        pad_obj.pad_created_on = datetime.now()
        pad_obj.save()
        pad_obj.pad_authors.add(pad_group_obj.user)
        return result['padID']

    def delete_group_pad(self,pad_id):
        Pad.objects.filter(pad_id=pad_id).delete()
        self.epclient.deletePad(pad_id)
        return True

    def getPadAuthorIDFor(self,user_id):
        pad_author_objs = PadAuthor.objects.filter(user_id=user_id)
        if pad_author_objs:
            return pad_author_objs[0].author_id

    def getPadGroupFor(self,user_id):
        pad_group_objs = PadGroup.objects.filter(user_id=user_id)
        if pad_group_objs:
            return pad_group_objs[0].group_id

    def create_session(self,group_id,author_id):
        nowtime = datetime.now()
        one_week_ahead = nowtime + timedelta(days=7)
        one_week_ahead_seconds = time.mktime(one_week_ahead.timetuple())
        result = self.epclient.createSession(group_id,author_id,one_week_ahead_seconds)
        if result.get("sessionID"):
            pad_session_obj = PadSession()
            pad_session_obj.author_id = author_id
            pad_session_obj.group_id = group_id
            pad_session_obj.session_id = result["sessionID"]
            pad_session_obj.session_created = datetime.now()
            pad_session_obj.expired_time = one_week_ahead
            pad_session_obj.save()
        return result.get("sessionID")

    # {code: 0, message:"ok", data: {authorID: "a.s8oes9dhwrvt0zif", groupID: g.s8oes9dhwrvt0zif, validUntil: 1312201246}}
    # {code: 1, message:"sessionID does not exist", data: null}
    def get_session_info(self,session_id):
        return self.epclient.getSessionInfo(session_id)

    def delete_ep_session(self,session_id):
        self.epclient.deleteSession(session_id)

    def get_ep_client(self):
        return self.epclient

# Create your views here.
class CreateGroupPad(View):
    def get(self,request,*args,**kwargs):
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
        pass

class DeletePad(View):
    def get(self,request,*args,**kwargs):
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