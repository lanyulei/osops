#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Time    : 2017/10/31 11:52
# @Author  : YuLei Lan
# @File    : urls.py
# @Software: PyCharm

from django.conf.urls import url
from app.index import views

urlpatterns = [
    url(r'^$', views.IndexHandler, name='index'),
]