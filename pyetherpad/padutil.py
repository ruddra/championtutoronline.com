__author__ = 'codengine'

from django.conf import settings
from py_etherpad import EtherpadLiteClient
from pyetherpad.models import *
from django.contrib.auth.models import User
from datetime import datetime
from datetime import timedelta
import json
import time
import uuid

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

    def create_group_pad(self,pad_group_id,pad_name=str(uuid.uuid4()),text=''):
        result = self.epclient.createGroupPad(pad_group_id,pad_name,text)
        pad_obj = Pad()
        pad_obj.pad_id = result['padID']
        pad_group_objs = PadGroup.objects.filter(group_id=pad_group_id)
        if pad_group_objs:
            pad_group_obj = pad_group_objs[0]
            pad_obj.pad_group = pad_group_obj
            pad_obj.pad_name = pad_name
            pad_obj.pad_created_by = pad_group_obj.user_id
            pad_obj.pad_created_on = datetime.now()
            pad_obj.save()
            pad_author = PadAuthor.objects.get(user=pad_group_obj.user)
            pad_obj.pad_authors.add(pad_author)
        return result['padID']

    def create_public_pad(self,pad_id):
        try:
            result = self.epclient.createPad(pad_id)
            return result["padID"]
        except Exception,msg:
            print "Exception occured. Exception message: %s" % str(msg)
            return False

    def make_pad_public(self,pad_id):
        return self.epclient.setPublicStatus(pad_id,"true")

    def rename_group_pad(self,pad_id,name):
        pad_objs = Pad.objects.filter(pad_id=pad_id)
        if not pad_objs:
            return False
        pad_objs[0].pad_name = name
        pad_objs[0].save()
        return True

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