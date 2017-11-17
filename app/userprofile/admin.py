# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from app.userprofile.user.admin import UserAdmin
from django.contrib import admin

from app.userprofile.user import models

# admin.site.register(models.UserPermissions)
# admin.site.register(models.OpToolsList)

# admin.site.unregister(Group)
admin.site.register(models.UserProfile, UserAdmin)