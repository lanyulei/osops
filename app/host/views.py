# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render, HttpResponse
from django.contrib.auth.decorators import login_required
import json

# Create your views here.

@login_required
def HostListHandler(request):
    return render(request, 'Host/list.html')
