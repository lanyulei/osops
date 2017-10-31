#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Time    : 2017/10/31 10:57
# @Author  : YuLei Lan
# @File    : urls.py
# @Software: PyCharm

from django.conf.urls import url
from app.layout import views

urlpatterns = [
    url(r'^$', views.LayoutHandler, name='layout'),
]