import yaml
import pymongo
from random import randint, choice
from datetime import datetime
from smtplib import SMTP_SSL
from ssl import create_default_context
from threading import Thread
from login_reg.models import Users


stream = open('oauth_settings.yml', 'r')
settings = yaml.safe_load(stream)
stream.close()

"""
link = "mongodb://admin:4gWGjt4TLkdlZg1B@cluster0-shard-00-00.xrq2g.mongodb.net:27017,cluster0-shard-00-01.xrq2g.\
mongodb.net:27017,cluster0-shard-00-02.xrq2g.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-1fpp0j-shard\
-0&authSource=admin&retryWrites=true&w=majority"
"""

dbclient = pymongo.MongoClient('localhost', 27017)
db = dbclient['thewebsite']


# noinspection SpellCheckingInspection
def sendmail(email, message):

    FROM = "mushkilotp@gmail.com"  # Enter your address
    TO = email  # Enter receiver address
    password = settings['app_password']

    server_ssl = SMTP_SSL("smtp.gmail.com", 465)
    server_ssl.ehlo()
    server_ssl.login(FROM, password)

    server_ssl.sendmail(FROM, TO, message)
    server_ssl.close()


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


# noinspection SpellCheckingInspection
def checkotp(email, otp):
    res = db['otp'].find_one({'email': email, 'otp': otp})
    if res:
        db['otp'].delete_many({'email': email})
        return True
    else:
        return False


# noinspection SpellCheckingInspection
def _send_reset_token(email, token, host):
    message = f"""
    Subject: Hi there

    Your password reset link is {host}/account/user/resetpassword/{token} It is valid for 1 hour.
    """
    sendmail(email, message)


# noinspection SpellCheckingInspection
def send_reset_token(email, host):
    token = ''.join([choice('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890') for _ in range(75)])
    db['resettoken'].insert({'token': token, 'email': email, 'createdat': datetime.utcnow()})
    Thread(target=_send_reset_token, args=(email, token, host)).start()


# noinspection SpellCheckingInspection
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


def _create_user(user_):
    Users.objects.create_user(id=settings["id"], username=user_['username'], email=user_['email'], password=user_['password1'])
    settings["id"] += 1
    file = open('oauth_settings.yml', 'w')
    yaml.dump(settings, file)
    file.close()


def check_user(email):
    try:
        Users.objects.get(email=email)
        return True
    except:
        return False
