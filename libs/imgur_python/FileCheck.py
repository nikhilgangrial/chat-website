#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Imgur file check
"""

import fleep


class FileCheck:
    """Check if file is ok to upload to imgur"""

    def __init__(self):
        self.file_types = FileCheck.__file_types()

    def check(self, filename):
        """Check the file type"""
        # check the file
        with open(filename, 'rb') as file:
            info = fleep.get(file.read(128))
        # return values
        if info.mime[0] in self.file_types.keys():
            return {
                'file_type': self.file_types[info.mime[0]],
                'type': 'file'
            }
        return None

    @staticmethod
    def __file_types():
        """Set the file types"""
        return {
            'image/gif': 'image',
            'image/jpeg': 'image',
            'image/jp2': 'image',
            'image/png': 'image',
            'image/apng': 'image',
            'image/tiff': 'image',
            'video/x-flv': 'video',
            'video/avi': 'video',
            'video/x-matroska': 'video',
            'video/quicktime': 'video',
            'video/mpeg': 'video',
            'video/x-ms-wmv': 'video',
            'video/webm': 'video'
        }
