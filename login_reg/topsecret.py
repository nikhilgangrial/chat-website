import yaml
import time
from requests_oauthlib import OAuth2Session
import pymongo
from random import randint, choice
from datetime import datetime
from smtplib import SMTP_SSL
from ssl import create_default_context
from threading import Thread
from login_reg.models import Users
import os
import webbrowser

stream = open('oauth_settings.yml', 'r')
settings = yaml.safe_load(stream)

"""
link = "mongodb://admin:4gWGjt4TLkdlZg1B@cluster0-shard-00-00.xrq2g.mongodb.net:27017,cluster0-shard-00-01.xrq2g.\
mongodb.net:27017,cluster0-shard-00-02.xrq2g.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-1fpp0j-shard\
-0&authSource=admin&retryWrites=true&w=majority"
"""

dbclient = pymongo.MongoClient('localhost', 27017)
db = dbclient['thewebsite']


def sendmail(email, message):

    port = 465  # For SSL
    smtp_server = "smtp.gmail.com"
    sender_email = "mushkilotp@gmail.com"  # Enter your address
    receiver_email = email  # Enter receiver address
    password = settings['email_password']

    context = create_default_context()  # ssl function
    with SMTP_SSL(smtp_server, port, context=context) as server:    # smtplib function
        server.login(sender_email, password)
        server.sendmail(sender_email, receiver_email, message)


def _sendotp(email, otp):
    message = f"""
    Subject: Hi there

    Your OTP is {otp}. It is valid for 2 minutes.
    """
    sendmail(email, message)


def sendotp(email):
    otp = randint(100000, 999999)
    db['otp'].insert({'email': email, 'otp': otp, 'created_at': datetime.utcnow()})
    Thread(target=_sendotp, args=(email, otp)).start()


def checkotp(email, otp):
    res = db['otp'].find_one({'email': email, 'otp': otp})
    if res:
        db['otp'].delete_many({'email': email})
        return True
    else:
        return False


def _send_reset_token(email, token, host):
    message = f"""
    Subject: Hi there

    Your password reset link is {host}/account/user/resetpassword/{token} It is valid for 1 hour.
    """
    sendmail(email, message)


def send_reset_token(email, host):
    token = ''.join([choice('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890') for _ in range(75)])
    db['resettoken'].insert({'token': token, 'email': email, 'createdat': datetime.utcnow()})
    Thread(target=_send_reset_token, args=(email, token, host)).start()


def check_reset_token(token, change=False):
    res = db['resettoken'].find_one({'token': token})
    if res:
        if change:
            db['resettoken'].delete_one({'token': token})
        return res['email']
    return None


def change_password(email, password):
    user = Users.objects.get(email=email)
    user.set_password(password)
    user.save()


def _create_user(user):
    Users.objects.create_user(**user)


def check_user(email):
    try:
        Users.objects.get(email=email)
        return True
    except:
        return False
