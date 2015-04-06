from django.contrib.auth.models import User
from django.db import models
from datetime import datetime
from image_cropping import ImageRatioField
from image_cropping.fields import ImageCropField


class Address(models.Model):
    street_address1 = models.TextField(blank=True, null=True, max_length=200)
    street_address2 = models.TextField(blank=True, null=True, max_length=200)
    city = models.TextField(blank=True, null=True, max_length=40)
    state = models.TextField(blank=True, null=True, max_length=40)
    zip = models.TextField(blank=True, null=True, max_length=40)
    country = models.TextField(blank=True, null=True, max_length=40)


class ProfilePicture(models.Model):
    image_field = ImageCropField(upload_to='image/')
    cropping = ImageRatioField('image_field', size='120x100', allow_fullsize=True)


class ChampUser(models.Model):
    user = models.OneToOneField(User)
    fullname = models.TextField(blank=False, null=False, max_length=100)
    phone = models.TextField(blank=False, null=False, max_length=20)
    address = models.ForeignKey(Address, null=True, default=None)
    profile_picture = models.ForeignKey(ProfilePicture, null=True, default=None)
    type = models.TextField(blank=True, null=True, max_length=10)
    # date_created = models.DateTimeField(auto_now_add=True, auto_now=True)
    # last_updated = models.DateField(auto_now_add=True)
    class Meta:
        db_table='champ_user'
            

class UserTimezoneSettings(models.Model):
    # user_id = models.ForeignKey(ChampUser)
    # timezone = models.CharField(max_length=6) ##This field will contain timezone information in +=360 format. Say timezone is UTC+6 then it will store -360
    # last_updated = models.DateField(auto_now_add=True)
    pass


class Role(models.Model):
    roles=(('Student','Student'),('Teacher','Teacher'))
    id=models.AutoField(primary_key=True)
    name=models.CharField(blank=False,null=False,max_length=10,choices=roles)


class OnlineStatus(models.Model):
    user_id = models.BigIntegerField()
    status = models.IntegerField(null=False,blank=False) ## 1 for online and 0 for offline


class Messages(models.Model):
    id = models.AutoField(primary_key=True)
    msg_date = models.DateTimeField(auto_now=True)
    msg = models.TextField()
    is_read = models.IntegerField(default=0)  ###0 for unread and 1 for read. Default is unread.
    chat_type = models.IntegerField(default=0) ###0 for p2p chat and 1 for group chat. Default is p2p chat.

    class Meta:
        db_table='champ_chat_messages'

class UserMessage(models.Model):
    sender_id = models.BigIntegerField(null=False,blank=False)
    receiver_id = models.BigIntegerField(null=False,blank=False)
    message_id = models.BigIntegerField(null=False,blank=False)
    last_seen = models.DateTimeField(auto_now=False)

    class Meta:
        db_table="user_message"


class OTSessionTable(models.Model):
    sessionid = models.CharField(blank=False,null=False,max_length=40)
    otsessionId = models.CharField(blank=False,null=False,max_length=60)
    ottoken = models.CharField(blank=True,null=True,max_length=400)

    class Meta:
        db_table='ot_session'



class ResetPasswordToken(models.Model):
    date_created = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(User)
    token = models.CharField(max_length=255)

        

