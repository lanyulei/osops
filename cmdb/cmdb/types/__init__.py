#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Time    : 2017/11/19 14:29
# @Author  : YuLei Lan
# @File    : __init__.py.py
# @Software: PyCharm
from importlib import import_module

# 对象缓存
class_cache = {}
instance_cache = {}


class BaseType:
    def __init__(self, **options):
        self.options = options

    def encode(self, value: str) -> str:
        ''' 编码 '''
        raise NotImplemented  # 未实现的异常

    def decode(self, value: str) -> str:
        ''' 解码 '''
        raise NotImplemented

    @classmethod
    def description(cls) -> str:
        ''' 用于描述数据类型 '''
        raise NotImplemented


def get_class(type: str):
    ''' 判断类型是否存在，存在则返回类型实例，反之则抛出异常'''
    if type in class_cache.keys():
        return class_cache[type]
    mod, cls = type.rsplit('.', 1)
    m = import_module(mod)
    c = getattr(m, cls)
    if issubclass(c, BaseType):
        class_cache[type] = c
        return c
    raise TypeError('type {} is not a type'.format(type))


def get_instance(type: str, **options) -> BaseType:
    encoded = '&'.join(['{}={}'.format(k, options[k]) for k in sorted(options.keys())])
    key = '{}?{}'.format(type, encoded)
    if key in instance_cache.keys():
        return instance_cache[key]
    o = get_class(type)(**options)
    instance_cache[key] = o
    return o


def encode(type: str, value: str, **options) -> str:
    return get_instance(type, **options).encode(value)


def decode(type: str, value: str, **options) -> str:
    return get_instance(type, **options).decode(value)


class Int(BaseType):
    def encode(self, value: str) -> str:
        val = int(value)
        if 'max' in self.options.keys() and val > self.options['max']:
            raise ValueError('value {} too bigger'.format(val))
        if 'min' in self.options.keys() and val < self.options['min']:
            raise ValueError('value {} too small'.format(val))
        return value

    def decode(self, value: str) -> str:
        return value

    @classmethod
    def description(cls):
        return '''
        # Int

        # options:

        * max: xxx
        * min: xxx
        '''
