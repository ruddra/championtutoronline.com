__author__ = 'codengine'

from py_etherpad import EtherpadLiteClient
import uuid

class PadUtil:
    def __init__(self):
        self.epclient = EtherpadLiteClient('f5560d6d5f946a6b72c7d4708965a0fca2258f7c1df1948db763ef7852019004', 'http://127.0.0.1:9001/api')

    def create_or_get_padauthor(self,user_id,name):
        result = self.epclient.createAuthorIfNotExistsFor(user_id,name)
        return result

    def create_or_get_padgroup(self,user_id):
        result = self.epclient.createGroupIfNotExistsFor(user_id)
        return result['groupID']

    def create_group_pad(self,pad_group_id,pad_name=str(uuid.uuid4()),text=''):
        result = self.epclient.createGroupPad(pad_group_id,pad_name,text)
        return result

pad_util = PadUtil()
print pad_util
print pad_util.create_or_get_padauthor(1,"Sohel")
pg = pad_util.create_or_get_padgroup(9999)
print pad_util.create_group_pad(pg)