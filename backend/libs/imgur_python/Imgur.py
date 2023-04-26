#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Imgur entry point
"""

from .Authorize import Authorize
from .Image import Image
from .FileCheck import FileCheck


class Imgur:
    """Imgur classes entry point"""

    __version__ = '0.2.1'

    def __init__(self, config):
        # config
        self.config = config
        self.api_url = 'https://api.imgur.com'
        # start the party
        self.auth = Authorize(self.config, self.api_url)
        self.image = Image(self.config, self.api_url)

    # Version

    def version(self):
        """API client version"""
        return 'Imgur API client {0}'.format(self.__version__)

    # Authorization

    def authorize(self):
        """Generate authorization url"""
        return self.auth.get_url()

    def access_token(self):
        """Generate new access token using the refresh token"""
        token = self.auth.generate_access_token()
        if token:
            self.update_config(token)
        return self.config

    def update_config(self, token):
        self.auth.config.update(token)
        self.image.config.update(token)
        self.config.update(token)

    # Image

    def images(self, page=0):
        """Get account images"""
        return self.image.images(page)

    def image_get(self, image_id):
        """Get information about an image"""
        return self.image.image(image_id)

    def image_upload(self, filename, title, description, album=None, disable_audio=1, f=None, _type=None):
        """Upload a new image or video"""
        files = None
        payload = {
            'title': title,
            'description': description
        }
        # album
        if album is not None:
            payload['album'] = album

        # file, video or url
        if filename.startswith('http'):
            payload['type'] = 'url'
            payload['image'] = filename
        elif not f:
            file_check = FileCheck()
            file_info = file_check.check(filename)
            if file_info is not None:
                payload['type'] = 'file'
                if file_info['file_type'] == 'image':
                    files = {
                        'image': open(filename, 'rb')
                    }

                elif file_info['file_type'] == 'video':
                    files = {
                        'video': open(filename, 'rb')
                    }
                    payload['disable_audio'] = disable_audio
                else:
                    raise TypeError("This is not accepted file format")
        elif f:
            payload['type'] = 'file'
            if _type == 'image':
                files = {
                    'image': f
                }

            elif _type == 'video':
                files = {
                    'video': f
                }
                payload['disable_audio'] = disable_audio
            else:
                raise TypeError("This is not accepted file format")
        return self.image.upload(payload, files)

    def image_update(self, image_id, title=None, description=None):
        """Updates the title or description of an image"""
        payload = {}
        if title is not None:
            payload['title'] = title
        if description is not None:
            payload['description'] = description
        return self.image.update(image_id, payload)

    def image_delete(self, image_id):
        """Deletes an image"""
        return self.image.delete(image_id)
