#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Time    : 2017/11/17 23:49
# @Author  : YuLei Lan
# @File    : models.py
# @Software: PyCharm

from app.assets import models


class SchemaService:
    @staticmethod
    def create(**data):
        ''' 创建schema '''
        try:
            models.Schema.objects.create(name=data.get('name'), display=data.get('display', data.get('name')))
        except Exception as e:
            raise e

    @staticmethod
    def remove(schema_id):
        ''' 删除schema '''
        try:
            schema = models.Schema.objects.get(id=schema_id)
            for field in schema.field_set.all():
                if not SchemaService.field_delable(field):  # 如果为真，则不允许删除schema
                    raise Exception('field {} not deleteable'.format(field.name))
            schema.deleted = True
            schema.save()
        except Exception as e:
            raise e

    @staticmethod
    def add_field(schema_id):
        ''' 添加field '''
        pass

    @staticmethod
    def remove_field(schema_id):
        ''' 删除field '''
        pass

    @staticmethod
    def change_field(schema_id):
        ''' 修改field '''
        pass

    @staticmethod
    def field_delable(field):
        ''' 判断是否可删除field '''
        if len(field.source_id.values()) > 0 or len(field.target_id.values()) > 0:
            # 当有关联的时候则不允许删除field及相关的schema
            return False
