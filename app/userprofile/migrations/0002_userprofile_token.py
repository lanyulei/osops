# -*- coding: utf-8 -*-
# Generated by Django 1.11.5 on 2017-11-05 07:15
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('userprofile', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='userprofile',
            name='token',
            field=models.CharField(blank=True, max_length=128, null=True, verbose_name='token'),
        ),
    ]
