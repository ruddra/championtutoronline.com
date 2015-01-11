from django.http import HttpResponse
from django.views.generic.base import View
from django.shortcuts import render
from forms import SignUpForm

class LoginView(View):
    def get(self,request,*args,**kwargs):
        pass
    def post(self,request,*args,**kwargs):
        pass

class SignUpView(View):
    def get(self,request,*args,**kwargs):
        signup_form = SignUpForm()
        return render(request,"registration.html",{'form':signup_form})

class HomePage(View):
    def get(self, request):
        return render(request, 'index.html', {'title':'Championtutor Online'})

class WhiteboardView(View):
    def get(self,request,*args,**kwargs):
        return render(request, 'whiteboard.html', {})

