#Author - Codengine

from django.conf import settings
from opentok import OpenTok
from opentok import MediaModes
from opentok import Roles

def create_ot_session(relayed=False):
	try:
		api_key = settings.OT_API_KEY
		api_secret = settings.OT_API_SECRET
		opentok = OpenTok(api_key, api_secret)
		media_mode = MediaModes.routed
		if relayed:
			media_mode = MediaModes.relayed
		session = opentok.create_session(media_mode=media_mode)
		return session.session_id
	except Exception,msg:
		print "Cannot create opentok sessin"
		print "Exception message: "+ str(msg)
		return False

def request_ot_token(session_id,*args,**kwargs):
	try:
		api_key = settings.OT_API_KEY
		api_secret = settings.OT_API_SECRET
		opentok = OpenTok(api_key, api_secret)
		token = opentok.generate_token(session_id)
		return token
	except Exception,msg:
		print "Failed to generate token on this session"
		print "Exception message: "+ str(msg)
		return False

def generate_ot_tokens(user_ids=[],moderator_uid=None,otsession=None):
	session = None
	if otsession:
		session = otsession
	else:
		session = create_ot_session()
	tokens = {"otsession":session,"ot_api_key":settings.OT_API_KEY}
	for i,uid in enumerate(user_ids):
		token = request_ot_token(session)
		tokens[uid] = token
	return tokens

if __name__ == "__main__":
	session_id = create_ot_session()
	print request_ot_token(session_id)
