__author__ = 'Codengine'

from django.http import HttpResponseRedirect
from django.core.urlresolvers import reverse

def user_login_required(funct):
    def wrapper(request,*args,**kwargs):
        if not request.session.get("is_login"):
            return HttpResponseRedirect(reverse("user_login"))
        return funct(request,*args,**kwargs)
    return wrapper
