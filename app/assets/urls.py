#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Time    : 2017/10/31 14:47
# @Author  : YuLei Lan
# @File    : urls.py
# @Software: PyCharm

from django.conf.urls import url
from app.assets import views

urlpatterns = [
    url(r'^list/', views.HostListHandler, name='list'),
]