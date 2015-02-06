# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0003_role'),
    ]

    operations = [
        migrations.AlterModelTable(
            name='onlinestatus',
            table='online_status',
        ),
        migrations.AlterModelTable(
            name='role',
            table='role',
        ),
    ]
