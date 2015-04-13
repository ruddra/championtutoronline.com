from django.shortcuts import render
from django.views.generic.base import View
from django.conf import settings
# Create your views here.

class BaseView(View):
	context_data = {}
