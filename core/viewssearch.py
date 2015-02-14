__author__ = 'codengine'

from django.views.generic.base import View
from django.http import HttpResponse
from models import User
import json

class SearchUserByKeyword(View):
	def get(self,request,*args,**kwargs):
		keyword = request.GET.get("term")
		print keyword
		users = User.objects.filter(fullname__icontains=keyword.strip())[:6]
		json_response = []
		for user in users:
			json_response += [
				{
					"id" : user.id,
					"pimage": "/static/images/profile_img.png", 
					"label" : user.fullname,
					"value" : str(user.id) + "|"+user.fullname
				}
			]
		return HttpResponse(json.dumps(json_response))