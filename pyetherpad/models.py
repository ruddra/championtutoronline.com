from django.db import models
from core.models import *

# Create your models here.
class PadAuthor(models.Model):
    user = models.ForeignKey(ChampUser)
    author_id = models.CharField(max_length=255,blank=False)
    created_on = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table=u'pad_author'

class PadGroup(models.Model):
    user = models.ForeignKey(ChampUser)
    group_id = models.CharField(max_length=255,blank=False)
    group_created_on = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table=u'pad_group'

class Pad(models.Model):
    pad_id = models.CharField(max_length=255)
    pad_group = models.ForeignKey(PadGroup)
    pad_name = models.CharField(max_length=255)
    pad_authors = models.ManyToManyField(PadAuthor)
    pad_created_by = models.IntegerField()
    pad_created_on = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table=u'pad'

class PadSession(models.Model):
    author_id = models.CharField(max_length=255)
    group_id = models.CharField(max_length=255)
    session_id = models.CharField(max_length=255)
    expired_time = models.DateTimeField()
    session_created = models.DateTimeField()

    class Meta:
        db_table=u'pad_session'