#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Time    : 2017/10/31 20:36
# @Author  : YuLei Lan
# @File    : urls.py
# @Software: PyCharm

from django.conf.urls import url
from app.userprofile import views

urlpatterns = [
    url(r'^list/', views.UserListHandler, name='list'),
]