from django.http import HttpResponse
from django.views.generic.base import View
from django.shortcuts import render

class HomePage(View):
    def get(self, request):
        return render(request, 'index.html', {'title':'Championtutor Online'})

