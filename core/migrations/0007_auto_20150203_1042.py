# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0006_chatmessages'),
    ]

    operations = [
        migrations.AlterField(
            model_name='chatmessages',
            name='id',
            field=models.AutoField(serialize=False, primary_key=True),
            preserve_default=True,
        ),
        migrations.AlterModelTable(
            name='chatmessages',
            table='champ_chat_messages',
        ),
    ]
