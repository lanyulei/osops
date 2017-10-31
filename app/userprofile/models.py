# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User

# Create your models here.

# 用户管理表
class UserProfile(models.Model):

    user = models.OneToOneField(User)
    name = models.CharField(u"姓名", max_length=32,default="")
    email = models.CharField(u"邮箱", max_length=32, default="")
    phone = models.CharField(u"手机", max_length=32, default="")
    qq = models.CharField(u"qq", max_length=32, default="")
    start_date = models.DateField(u"入职时间",null=True, blank=True)

    def __str__(self):
        return self.name