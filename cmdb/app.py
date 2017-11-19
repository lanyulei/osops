#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Time    : 2017/11/19 15:54
# @Author  : YuLei Lan
# @File    : app.py
# @Software: PyCharm

from cmdb.types import encode, decode

from cmdb.types import Int

print(encode('cmdb.types.Int', '10', min=9))
# # print(decode('cmdb.types.Int', encode('cmdb.types.Int', '10', min=15)))