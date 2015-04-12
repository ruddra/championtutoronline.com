__author__ = 'codengine'

from django.views.generic.base import View
from django.shortcuts import render
from django.http import HttpResponse
from forms import PaymentMethodForm
from models import *
from datetime import datetime
import json

class PaymentMethodAjaxView(View):
    def get(self,request,*args,**kwargs):
        return HttpResponse("Invalid")
    def post(self,request,*args,**kwargs):
        response = {
            "STATUS": "",
            "MESSAGE": ""
        }
        if request.is_ajax():
            pm_form = PaymentMethodForm(request.POST)
            if pm_form.is_valid():
                try:
                    first_name = pm_form.cleaned_data["first_name"]
                    last_name = pm_form.cleaned_data["last_name"]
                    card_type = pm_form.cleaned_data["card_type"]
                    card_number = pm_form.cleaned_data["card_number"]
                    expired_date = pm_form.cleaned_data["exp_date"]
                    cvn = pm_form.cleaned_data["cvn"]
                    # primary = pm_form.cleaned_data["primary"]
                    # active = pm_form.cleaned_data["active"]

                    # primary = 1 if primary == "primary" else 0
                    #
                    # active = 1 if active else 0

                    date_obj = datetime.strptime(expired_date,"%m/%Y")

                    payment_method = PaymentMethod()
                    payment_method.user = request.user
                    payment_method.first_name = first_name
                    payment_method.last_name = last_name
                    payment_method.card_type = card_type
                    payment_method.card_number = card_number
                    payment_method.month = date_obj.month
                    payment_method.year = date_obj.year
                    payment_method.code = cvn
                    # payment_method.is_primary = primary
                    # payment_method.active = active
                    payment_method.save()

                    response["STATUS"] = "SUCCESS"
                    response["MESSAGE"] = "Payment Method Added Successfully."
                    return HttpResponse(json.dumps(response))
                except Exception,msg:
                    print msg
                    response["STATUS"] = "FAILURE"
                    response["MESSAGE"] = "Server error"
                    return HttpResponse(json.dumps(response))

            else:
                response["STATUS"] = "FAILURE"
                response["MESSAGE"] = "Please fill up the form correctly."
                return HttpResponse(json.dumps(response))
        else:
            response["STATUS"] = "FAILURE"
            response["MESSAGE"] = "Invalid operation"
            return HttpResponse(json.dumps(response))
