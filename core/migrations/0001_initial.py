# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True)),
                ('fullname', models.TextField(max_length=100)),
                ('password', models.TextField(max_length=200)),
                ('email', models.TextField(max_length=100)),
                ('phone', models.TextField(max_length=20)),
                ('street_address1', models.TextField(max_length=200, null=True, blank=True)),
                ('street_address2', models.TextField(max_length=200, null=True, blank=True)),
                ('city', models.TextField(max_length=40, null=True, blank=True)),
                ('state', models.TextField(max_length=40, null=True, blank=True)),
                ('zip', models.TextField(max_length=40, null=True, blank=True)),
                ('country', models.TextField(max_length=40, null=True, blank=True)),
                ('type', models.TextField(max_length=10, null=True, blank=True)),
            ],
            options={
                'db_table': 'champ_user',
            },
            bases=(models.Model,),
        ),
    ]
