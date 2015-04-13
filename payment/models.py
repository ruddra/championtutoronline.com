from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class SupportedPaymentMethod(models.Model):
    name = models.CharField(max_length=255)
    short_name = models.CharField(max_length=10)

    class Meta:
        db_table=u'supported_payment_methods'

class PaymentMethod(models.Model):
    user = models.ForeignKey(User)
    card_number = models.CharField(max_length=255)
    card_type = models.CharField(max_length=30)
    month = models.IntegerField(max_length=2)
    year = models.IntegerField(max_length=4)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    code = models.CharField(max_length=30)
    active = models.IntegerField()
    is_primary = models.IntegerField()
    date_added = models.DateTimeField(auto_now_add=True,blank=False)

    class Meta:
        db_table=u'payment_method'

class Transaction(models.Model):
    user = models.ForeignKey(User)
    payment_method = models.ForeignKey(PaymentMethod)
    transaction_status = models.IntegerField() ###1 means success, 0 means failure.
    transaction_amount = models.FloatField()
    transaction_date = models.DateTimeField(auto_now_add=True,blank=False)
    description = models.TextField()

    class Meta:
        db_table=u'transaction'

class PaymentHistory(models.Model):
    transaction = models.ForeignKey(Transaction)

    class Meta:
        db_table=u'payment_history'

class PaymentLog(models.Model):
    pass
