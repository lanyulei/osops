# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from app.userprofile.user.models import UserProfile


# Create your models here.

# 用户管理表
# class UserProfile(User):
#
#     user = models.OneToOneField(User)
#     name = models.CharField(u"姓名", max_length=32, blank=True, null=True)
#     phone = models.CharField(u"手机", max_length=32, blank=True, null=True)
#     qq = models.CharField(u"qq", max_length=32, blank=True, null=True)
#     token = models.CharField(u'token', max_length=128, blank=True, null=True)
#
#     def __str__(self):
#         return self.name