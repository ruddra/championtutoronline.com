from django.db import models

class User(models.Model):
    id= models.AutoField(primary_key=True)
    fullname = models.TextField(blank=False,null=False,max_length=100)
    password = models.TextField(blank=False,null=False,max_length=200)
    email = models.TextField(blank=False,null=False,max_length=100)
    phone = models.TextField(blank=False,null=False,max_length=20)
    street_address1 = models.TextField(blank=True,null=True,max_length=200)
    street_address2 = models.TextField(blank=True,null=True,max_length=200)
    city = models.TextField(blank=True,null=True,max_length=40)
    state = models.TextField(blank=True,null=True,max_length=40)
    zip = models.TextField(blank=True,null=True,max_length=40)
    country = models.TextField(blank=True,null=True,max_length=40)
    type = models.TextField(blank=True,null=True,max_length=10)

    class Meta:
        db_table = 'champ_user'

