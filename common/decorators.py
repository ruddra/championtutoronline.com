__author__ = 'Codengine'

from django.http import HttpResponseRedirect, HttpResponse
from django.core.urlresolvers import reverse

def user_login_required(funct):
    def wrapper(request,*args,**kwargs):
        if not request.session.get("is_login"):
        	request_path = request.path
        	redirect_url = reverse("user_login")+"?next="+request_path
        	return HttpResponseRedirect(redirect_url) if not request.is_ajax() else HttpResponse("LOGIN_REQUIRED")
        return funct(request,*args,**kwargs)
    return wrapper
