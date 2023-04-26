#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Generate authorization link
"""

import requests
from .ImgurBase import ImgurBase
import datetime


class Authorize(ImgurBase):
    """Class to authorize account with the app"""

    def __init__(self, config, api_url):
        self.config = config
        self.api_url = api_url

    def get_url(self):
        """Generate authorization url"""
        url = '{0}/oauth2/authorize?client_id={1}&response_type=token'
        return url.format(self.api_url, self.config['client_id'])

    def generate_access_token(self):
        """Generate access token with the refresh token"""
        if self.config['expires_at'] > datetime.datetime.now().timestamp():
            return None
        else:
            url = '{0}/oauth2/token'.format(self.api_url)
            payload = {
                'refresh_token': self.config['refresh_token'],
                'client_id': self.config['client_id'],
                'client_secret': self.config['client_secret'],
                'grant_type': 'refresh_token'
            }
            request = requests.post(url, data=payload)
            temp = self.response(request, url)
            temp['response']['expires_at'] = datetime.datetime.now().timestamp() + temp['response']['expires_in'] - 100
            return temp['response']
