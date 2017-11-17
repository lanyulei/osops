#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Time    : 2017/11/5 14:38
# @Author  : YuLei Lan
# @File    : models.py
# @Software: PyCharm

from django.contrib.auth.models import Permission
from django.db import models
from django.contrib.auth.models import (BaseUserManager, AbstractBaseUser,
                                        PermissionsMixin, Group)


class UserProfileManager(BaseUserManager):
    def create_user(self, username, name, email, password=None):
        """
        Creates and saves a User with the given username, date of
        birth and password.
        """
        if not username:
            raise ValueError('Users must have an username address')

        # 开始创建账号
        user = self.model(
            username=self.normalize_email(username), name=name, email=email)
        # 设置密码
        user.set_password(password)
        user.save(using=self._db)
        return user

    # 创建管理员
    def create_superuser(self, username, name, email, password):
        """
        Creates and saves a superuser with the given username, date of
        birth and password.
        """
        user = self.create_user(
            username,
            password=password,
            name=name,
            email=email, )
        user.is_admin = True
        user.save(using=self._db)
        return user


# 在这里设置你需要的字段
class UserProfile(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(
        verbose_name='username',
        max_length=128,
        unique=True, )
    email = models.EmailField(
        verbose_name='email',
        max_length=255,
        null=True,
        blank=True,
        unique=True, )
    first_name = models.CharField(
        verbose_name='名字', max_length=64, null=True, blank=True)
    last_name = models.CharField(
        verbose_name='姓', max_length=64, null=True, blank=True)
    name = models.CharField(max_length=128, null=True, blank=True, unique=True)
    is_active = models.BooleanField(verbose_name='是否可用', default=True)
    is_admin = models.BooleanField(verbose_name='是否管理员', default=False)
    token = models.CharField(u'token', max_length=128, blank=True, null=True)
    # department = models.CharField(max_length=128, verbose_name='所属部门', null=True, blank=True)
    # groups = models.ManyToManyField(
    #     Group,
    #     verbose_name=('groups'),
    #     blank=True,
    #     help_text=(
    #         'The groups this user belongs to. A user will get all permissions '
    #         'granted to each of their groups.'
    #     ),
    #     related_name="user_set",
    #     related_query_name="user",
    # )
    objects = UserProfileManager()

    # 使用username作为必须的字段
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['name', 'email']

    def get_full_name(self):
        # The user is identified by their username address
        return self.username

    def get_short_name(self):
        # The user is identified by their username address
        return self.username

    def __unicode__(self):  # __unicode__ on Python 2
        return self.username

    def has_perms(self, perm, obj=None):
        "Does the user have a specific permission?"
        # Simplest possible answer: Yes, always
        return True

    def has_module_perms(self, app_label):
        "Does the user have permissions to view the app `app_label`?"
        # Simplest possible answer: Yes, always
        return True

    @property
    def is_staff(self):
        "Is the user a member of staff?"
        # Simplest possible answer: All admins are staff
        return self.is_admin

    class Meta:
        verbose_name = '用户管理'
        verbose_name_plural = "用户管理"