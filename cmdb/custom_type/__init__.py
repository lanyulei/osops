#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Time    : 2017/11/19 16:10
# @Author  : YuLei Lan
# @File    : __init__.py.py
# @Software: PyCharm

import socket
import struct
from cmdb.types import BaseType


class IP(BaseType):
    def encode(self, value: str) -> str:
        return str(struct.unpack('!L', socket.inet_aton(value))[0])

    def decode(self, value: str) -> str:
        return socket.inet_ntoa(struct.pack('!L', int(value)))
