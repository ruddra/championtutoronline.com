# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Messages',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('msg_date', models.DateField(auto_now_add=True)),
                ('msg', models.TextField()),
                ('is_read', models.IntegerField(default=0)),
                ('chat_type', models.IntegerField(default=0)),
            ],
            options={
                'db_table': 'champ_chat_messages',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='OnlineStatus',
            fields=[
                ('id', models.AutoField(verbose_name='ID', auto_created=True, primary_key=True, serialize=False)),
                ('user_id', models.BigIntegerField()),
                ('status', models.IntegerField()),
            ],
            options={
                'db_table': 'online_status',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='OTSessionTable',
            fields=[
                ('id', models.AutoField(verbose_name='ID', auto_created=True, primary_key=True, serialize=False)),
                ('sessionid', models.CharField(max_length=40)),
                ('otsessionId', models.CharField(max_length=60)),
                ('ottoken', models.CharField(blank=True, null=True, max_length=400)),
            ],
            options={
                'db_table': 'ot_session',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Role',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=10, choices=[('Student', 'Student'), ('Teacher', 'Teacher')])),
            ],
            options={
                'db_table': 'role',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('fullname', models.TextField(max_length=100)),
                ('password', models.TextField(max_length=200)),
                ('email', models.TextField(max_length=100)),
                ('phone', models.TextField(max_length=20)),
                ('street_address1', models.TextField(blank=True, null=True, max_length=200)),
                ('street_address2', models.TextField(blank=True, null=True, max_length=200)),
                ('city', models.TextField(blank=True, null=True, max_length=40)),
                ('state', models.TextField(blank=True, null=True, max_length=40)),
                ('zip', models.TextField(blank=True, null=True, max_length=40)),
                ('country', models.TextField(blank=True, null=True, max_length=40)),
                ('type', models.TextField(blank=True, null=True, max_length=10)),
            ],
            options={
                'db_table': 'champ_user',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='UserMessage',
            fields=[
                ('id', models.AutoField(verbose_name='ID', auto_created=True, primary_key=True, serialize=False)),
                ('sender_id', models.BigIntegerField()),
                ('receiver_id', models.BigIntegerField()),
                ('message_id', models.BigIntegerField()),
                ('last_seen', models.DateField()),
            ],
            options={
                'db_table': 'user_message',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='UserTimezoneSettings',
            fields=[
                ('id', models.AutoField(verbose_name='ID', auto_created=True, primary_key=True, serialize=False)),
                ('user_id', models.BigIntegerField()),
                ('timezone', models.CharField(max_length=6)),
                ('last_updated', models.DateField(auto_now_add=True)),
            ],
            options={
                'db_table': 'user_timezone_settings',
            },
            bases=(models.Model,),
        ),
    ]
