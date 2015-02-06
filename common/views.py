from django.shortcuts import render
from django.views.generic.base import View
from django.conf import settings
# Create your views here.

class TemplateView(View):
	template_name = "index.html"
	common_data_context = settings.COMMON_DATA_CONTEXT

	@property
    def prepare_context_data(self,request,*args,**kwargs):
        raise NotImplementedError("Subclasses should implement this!")

	def get(self,request,*args,**kwargs):
		context_data = self.prepare_context_data(request,*args,**kwargs)
		#Merge context data.
		context_data = dict(common_data_context.items()+context_data)
		return render(request, template_name, context_data)

	def post(self,request,*args,**kwargs):
		context_data = self.prepare_context_data(request,*args,**kwargs)
		#Merge context data.
		context_data = dict(common_data_context.items()+context_data)
		return render(request, template_name, context_data)
