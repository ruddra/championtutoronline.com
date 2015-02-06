# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0005_messages_otsessiontable'),
    ]

    operations = [
        migrations.CreateModel(
            name='ChatMessages',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('sender_id', models.BigIntegerField()),
                ('receiver_id', models.BigIntegerField()),
                ('msg_date', models.DateField(auto_now_add=True)),
                ('last_updated', models.DateField(auto_now=True)),
                ('msg', models.TextField()),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
