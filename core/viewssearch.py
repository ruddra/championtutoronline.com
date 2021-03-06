__author__ = 'codengine'

from django.views.generic.base import View
from django.http import HttpResponse
from models import ChampUser
import json

class SearchUserByKeyword(View):
	def get(self,request,*args,**kwargs):
		keyword = request.GET.get("term")
		excludes = request.GET.get("exclude")
		excludes = excludes.split(",")
		excludes = [int(i) for i in excludes]
		this_uid = request.session["user_id"]
		excludes += [this_uid]
		users = ChampUser.objects.filter(fullname__icontains=keyword.strip()).exclude(user__id__in=excludes)[:7]
		json_response = []
		for user in users:
			json_response += [
				{
					"id" : user.user_id,
					"pimage": "/static/images/profile_img.png", 
					"label" : user.fullname,
					"value" : str(user.user_id) + "|"+user.fullname
				}
			]
		return HttpResponse(json.dumps(json_response))