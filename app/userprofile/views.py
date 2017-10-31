# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render, HttpResponse, HttpResponseRedirect
from app.userprofile import models
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
import json

# Create your views here.

''' 登录 '''
def LoginHandler(request):
    if request.method == 'POST':
        # django内置的账号验证方法
        user = authenticate(username=request.POST.get('username'),
                            password=request.POST.get('password'))
        if user is not None:
            # 验证成功login方式是确定已经验证成功的意思
            login(request, user)
            # 账号验证成功后跳转到“/”
            return HttpResponseRedirect('/')
    return render(request, 'UserProfile/login.html')

''' 退出登录 '''
def LogoutHandler(request):
    logout(request)
    return HttpResponseRedirect('/index/')

@login_required
def UserListHandler(request):

    userlist = User.objects.all().values()

    return render(request, 'UserProfile/userlist.html', {
        'userlist': userlist
    })