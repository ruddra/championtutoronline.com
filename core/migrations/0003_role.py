# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0002_onlinestatus'),
    ]

    operations = [
        migrations.CreateModel(
            name='Role',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True)),
                ('name', models.CharField(max_length=10, choices=[(b'Student', b'Student'), (b'Teacher', b'Teacher')])),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
