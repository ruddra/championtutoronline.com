__author__ = 'Codengine'

from django.http import HttpResponseRedirect
from django.core.urlresolvers import reverse

def login_required(func):
    def wrapper(request,*args,**kwargs):
        if not request.session.get('logged_in'):
            return HttpResponseRedirect(reverse('user_login'))
        return func(request,*args,**kwargs)
    return wrapper
