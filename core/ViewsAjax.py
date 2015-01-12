__author__ = 'Codengine'

from django.views.generic.base import View
from django.shortcuts import render
from django.http import HttpResponse
from forms import SignUpForm

class DrawingBoardAjaxView(View):
    def get(self,request,*args,**kwargs):
        if request.is_ajax():
            return render(request,"ajax/drawingboard.html",{})
        else:
            return HttpResponse("Invalid Request")

class TextEditorAjaxView(View):
    def get(self,request,*args,**kwargs):
        if request.is_ajax():
            return render(request,"ajax/text_editor.html",{})
        else:
            return HttpResponse("Invalid Request")

class CodeEditorAjaxView(View):
    def get(self,request,*args,**kwargs):
        if request.is_ajax():
            return render(request,"ajax/code_editor.html",{})
        else:
            return HttpResponse("Invalid Request")

class SignUpAjaxView(View):
    def get(self,request,*args,**kwargs):
        form = SignUpForm()
        return render(request,"ajax/signup_form.html",{"form":form})

