#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Time    : 2017/10/31 14:47
# @Author  : YuLei Lan
# @File    : models.py
# @Software: PyCharm

from django.db import models


class Schema(models.Model):
    name = models.CharField(max_length=45, unique=True)
    display = models.CharField(max_length=45, unique=True)
    deleted = models.BooleanField(default=False)

    class Meta:
        db_table = "schema"


class Field(models.Model):
    ''' 字段表 '''

    schema = models.ForeignKey(Schema)
    name = models.CharField(max_length=45, unique=True)
    display = models.CharField(max_length=45, unique=True)
    type_choice = (
        ('TYPE_INT', 0),
        ('TYPE_FLOAT', 1),
        ('TYPE_STRING', 2),
        ('TYPE_DATETIME', 3),
        ('TYPE_IP', 4),
    )
    type = models.IntegerField(choices=type_choice, default=2)
    required = models.BooleanField(default=True)
    multi = models.BooleanField(default=False)
    unique = models.BooleanField(default=False)
    default = models.BinaryField()
    deleted = models.BooleanField(default=False)

    class Meta:
        db_table = "field"


class FieldHistory(models.Model):
    schema = models.ForeignKey(Schema)
    name = models.CharField(max_length=45, unique=True)
    display = models.CharField(max_length=45, unique=True)
    type_choice = (
        ('TYPE_INT', 0),
        ('TYPE_FLOAT', 1),
        ('TYPE_STRING', 2),
        ('TYPE_DATETIME', 3),
        ('TYPE_IP', 4),
    )
    type = models.IntegerField(choices=type_choice, default=2)
    required = models.BooleanField(default=True)
    multi = models.BooleanField(default=False)
    unique = models.BooleanField(default=False)
    default = models.BinaryField()
    deleted = models.BooleanField(default=False)

    field = models.ForeignKey(Field)
    timestamp = models.DateTimeField(db_index=True)

    class Meta:
        db_table = "field_history"


class Relationship(models.Model):
    ''' 关系表 '''

    source = models.ForeignKey(Field, related_name='source_id')
    target = models.ForeignKey(Field, related_name='target_id')

    class Meta:
        db_table = "relationship"


class Entity(models.Model):

    schema = models.ForeignKey(Schema)

    class Meta:
        db_table = "entity"


class Value(models.Model):

    entity = models.ForeignKey(Entity)
    field = models.ForeignKey(Field)
    value = models.BinaryField()
    # value = models.BinaryField(db_index=True)

    class Meta:
        db_table = 'value'


class ValueHistory(models.Model):

    entity = models.ForeignKey(Entity)
    field = models.ForeignKey(Field)
    value = models.BinaryField()
    # value = models.BinaryField(db_index=True)
    timestamp = models.DateTimeField(db_index=True)
    deleted = models.BooleanField(default=False)

    class Meta:
        db_table = 'value_history'
