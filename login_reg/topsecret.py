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
settings = yaml.load(stream, yaml.SafeLoader)
authorize_url = '{0}{1}'.format(settings['authority'], settings['authorize_endpoint'])
token_url = '{0}{1}'.format(settings['authority'], settings['token_endpoint'])

os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'
os.environ['OAUTHLIB_RELAX_TOKEN_SCOPE'] = '1'

token = {}


def get_token_from_code(callback_url, expected_state):
    # Initialize the OAuth client
    aad_auth = OAuth2Session(settings['app_id'], state=expected_state, scope=settings['scopes'],
                             redirect_uri=settings['redirect'])

    token = aad_auth.fetch_token(token_url, client_secret=settings['app_secret'], authorization_response=callback_url)
    return token


def store_token(token_):
    global token
    token = token_


def get_sign_in_url():
    # Initialize the OAuth client
    aad_auth = OAuth2Session(settings['app_id'], scope=settings['scopes'], redirect_uri=settings['redirect'])

    sign_in_url, state = aad_auth.authorization_url(authorize_url, prompt='login')

    webbrowser.open(sign_in_url)


get_sign_in_url()


def get_token():
    global token
    if token:
        now = time.time()
        expire_time = token['expires_at'] - 300
        if now >= expire_time:
            aad_auth = OAuth2Session(settings['app_id'], token=token, scope=settings['scopes'],
                                     redirect_uri=settings['redirect'])

            refresh_params = {'client_id': settings['app_id'], 'client_secret': settings['app_secret']}
            new_token = aad_auth.refresh_token(token_url, **refresh_params)
            token = new_token
        return token


def _get_user(post):
    email = post['email']
    token = get_token()
    graph_client = OAuth2Session(token=token)
    user = graph_client.get(f"https://graph.microsoft.com/v1.0/users?$filter=userPrincipalName eq '{email}'")
    if user.status_code == 200:
        user = user.json()['value'][0]
        res = {'email': email, 'userid': user['id'], 'password': post['password1'], 'username': post['username'],
               'phoneno': user['mobilePhone']}
        temp = user['displayName'].split()[0]
        if temp.isdigit():
            res['type'] = 'Student'
            res['rollno'] = int(temp)
            res['regno'] = int(email.split('_')[1].split('@')[0])
            classes = {'1': 'ETC A', '2': 'MECHANICAL', '3': 'COMP A', '4': 'IT',
                       '5': 'ETC B', '6': 'MECHANICAL PG', '7': 'COMP B'}
            res['stu_class'] = classes[temp[0]]
            year = {'1': 'FE', '2': 'SE', '3': 'TE', '4': 'BE'}
            res['year'] = year[temp[1]]

        elif temp[:6] == "Alumni":
            res['type'] = "Alumni"
            res['regno'] = int(email.split('_')[1].split('@')[0])
        else:
            res['type'] = "Staff"
        return res
    raise ValueError


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
    password = "69@vahi sochna mushkil hai69"

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
