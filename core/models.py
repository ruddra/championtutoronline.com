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

class Role(models.Model):
    roles=(('Student','Student'),('Teacher','Teacher'))
    id=models.AutoField(primary_key=True)
    name=models.CharField(blank=False,null=False,max_length=10,choices=roles)

    class Meta:
        db_table='role'

class OnlineStatus(models.Model):
    user_id = models.BigIntegerField()
    status = models.IntegerField(null=False,blank=False) ## 1 for online and 0 for offline
    
    class Meta:
        db_table='online_status'

class Messages(models.Model):
    pass

class ChatMessages(models.Model):
    id = models.AutoField(primary_key=True)
    sender_id = models.BigIntegerField(null=False,blank=False)
    receiver_id = models.BigIntegerField(null=False,blank=False)
    msg_date = models.DateField(null=False,blank=False,auto_now_add=True)
    last_updated = models.DateField(null=False,blank=False,auto_now=True)
    msg = models.TextField()

    class Meta:
        db_table='champ_chat_messages'

class OTSessionTable(models.Model):
    sessionid = models.CharField(blank=False,null=False,max_length=40)
    otsessionId = models.CharField(blank=False,null=False,max_length=60)
    ottoken = models.CharField(blank=True,null=True,max_length=400)

    class Meta:
        db_table='ot_session'
        

