import yaml
import time
from requests_oauthlib import OAuth2Session
import pymongo
from random import randint, choice
import datetime
from threading import Thread

stream = open('oauth_settings.yml', 'r')
settings = yaml.load(stream, yaml.SafeLoader)
authorize_url = '{0}{1}'.format(settings['authority'], settings['authorize_endpoint'])
token_url = '{0}{1}'.format(settings['authority'], settings['token_endpoint'])

token = {
    'access_token': 'eyJ0eXAiOiJKV1QiLCJub25jZSI6ImZlY0VBUklxTnN1V3U3ZF9nNHpSUF9sc2FLcmVtN0VHT1B1NndGRzFrSU0iLCJhbGciOiJSUzI1NiIsIng1dCI6Im5PbzNaRHJPRFhFSzFqS1doWHNsSFJfS1hFZyIsImtpZCI6Im5PbzNaRHJPRFhFSzFqS1doWHNsSFJfS1hFZyJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC82ZDI4ZTRmYi05MDc0LTRhMGItYTViOC05YTg5ZjYzMmNjNjAvIiwiaWF0IjoxNjIyNzM5NTY4LCJuYmYiOjE2MjI3Mzk1NjgsImV4cCI6MTYyMjc0MzQ2OCwiYWNjdCI6MCwiYWNyIjoiMSIsImFjcnMiOlsidXJuOnVzZXI6cmVnaXN0ZXJzZWN1cml0eWluZm8iLCJ1cm46bWljcm9zb2Z0OnJlcTEiLCJ1cm46bWljcm9zb2Z0OnJlcTIiLCJ1cm46bWljcm9zb2Z0OnJlcTMiLCJjMSIsImMyIiwiYzMiLCJjNCIsImM1IiwiYzYiLCJjNyIsImM4IiwiYzkiLCJjMTAiLCJjMTEiLCJjMTIiLCJjMTMiLCJjMTQiLCJjMTUiLCJjMTYiLCJjMTciLCJjMTgiLCJjMTkiLCJjMjAiLCJjMjEiLCJjMjIiLCJjMjMiLCJjMjQiLCJjMjUiXSwiYWlvIjoiRTJaZ1lIaFh5dnYwMzZ5SXRJY3JQNll0S0Q3ZDRpLysrM1hhdG9PaVRSbjVEOXRrT3RvQiIsImFtciI6WyJwd2QiXSwiYXBwX2Rpc3BsYXluYW1lIjoiR3JhcGggZXhwbG9yZXIgKG9mZmljaWFsIHNpdGUpIiwiYXBwaWQiOiJkZThiYzhiNS1kOWY5LTQ4YjEtYThhZC1iNzQ4ZGE3MjUwNjQiLCJhcHBpZGFjciI6IjAiLCJmYW1pbHlfbmFtZSI6IlNJTkdIIiwiZ2l2ZW5fbmFtZSI6Ik5JS0hJTCIsImlkdHlwIjoidXNlciIsImlwYWRkciI6IjIwNS4yNTMuMTMwLjIxMiIsIm5hbWUiOiI3MTM3IE5JS0hJTCBTSU5HSCIsIm9pZCI6IjI4MTc1ZTA4LTE3NDgtNDVkMy05ZTNlLWU4ZjZkZTkyYTIxYyIsInBsYXRmIjoiMyIsInB1aWQiOiIxMDAzMjAwMEYxRTUwNjAwIiwicmgiOiIwLkFUNEEtLVFvYlhTUUMwcWx1SnFKOWpMTVlMWElpOTc1MmJGSXFLMjNTTnB5VUdRLUFLMC4iLCJzY3AiOiJvcGVuaWQgcHJvZmlsZSBVc2VyLlJlYWQgVXNlci5SZWFkQmFzaWMuQWxsIGVtYWlsIiwic2lnbmluX3N0YXRlIjpbImttc2kiXSwic3ViIjoiZUM4NTlBeG8yTVoxTk5BMjY3UjJLeUpmTURmU0QwWEFiQkxnQ1hCQllrOCIsInRlbmFudF9yZWdpb25fc2NvcGUiOiJBUyIsInRpZCI6IjZkMjhlNGZiLTkwNzQtNGEwYi1hNWI4LTlhODlmNjMyY2M2MCIsInVuaXF1ZV9uYW1lIjoibmlraGlsc2luZ2hfMjAyMjlAYWl0cHVuZS5lZHUuaW4iLCJ1cG4iOiJuaWtoaWxzaW5naF8yMDIyOUBhaXRwdW5lLmVkdS5pbiIsInV0aSI6Im9wUERRbzFFelUtamZ5ZTIwWTl1QWciLCJ2ZXIiOiIxLjAiLCJ3aWRzIjpbImI3OWZiZjRkLTNlZjktNDY4OS04MTQzLTc2YjE5NGU4NTUwOSJdLCJ4bXNfc3QiOnsic3ViIjoiMmQxdm1XSXdmc1NzUVVuX0lFZGxxa0JNV1RVNzJBeVhkZWhHYnFya25VYyJ9LCJ4bXNfdGNkdCI6MTM2NjA1MzgxMH0.mgNkCQ-qviJxsn3InGEHQgwuTukFkg9MaPP2dxtBRz01d2EDuN5yT7jQU_tn9s0lCbayl_2r7E1zRPwFbMtAFKgnOhS7RO87gluo85LtgRxPIIZ_Mz5VZGHq7hG6t0T7qqEm4MNFWJdfva-QBMveZQ9bNNK-OAgTnqj5nRXljpM41pW2aIdITKvJshWh-Zyd53naIqIzQQW7P0NOFgEPPz3nhAB6pPjvMUSu0b0wgo0emNrYZjElXRac3Oon759Jg4bk3Hot4zMmMUcNawwt-iNx9eN0d1Q9y6jT9mMqPGPOs61k3aMY5h6PvTAEmr2VLOALRY3jStXIWWOfsdPSZQ',
    'expires_at': 1622741654.633137,
    'expires_in': 3600,
    'ext_expires_in': 3600,
    'id_token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6ImJXOFpjTWpCQ25KWlMtaWJYNVVRRE5TdHZ4NCJ9.eyJ2ZXIiOiIyLjAiL'
                'CJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vOTE4ODA0MGQtNmM2Ny00YzViLWIxMTItMzZhMzA0YjY2ZGF'
                'kL3YyLjAiLCJzdWIiOiJBQUFBQUFBQUFBQUFBQUFBQUFBQUFMdGZ6QmVQQVNQQ2VaSzExc2dBa19VIiwiYXVkIjoiMWY4ZTkxODAtO'
                'WJiMi00OTgwLTljMTAtYjk2MDJmZDZmMzA0IiwiZXhwIjoxNjIyODI0NDU0LCJpYXQiOjE2MjI3Mzc3NTQsIm5iZiI6MTYyMjczNzc'
                '1NCwibmFtZSI6Ik5JS0hJTCBTSU5HSCIsInByZWZlcnJlZF91c2VybmFtZSI6Im5pa2hpbGdhbmdyaWFsQGdtYWlsLmNvbSIsIm9pZ'
                'CI6IjAwMDAwMDAwLTAwMDAtMDAwMC1jZDU1LWE2M2I4ODY0NWQzOSIsInRpZCI6IjkxODgwNDBkLTZjNjctNGM1Yi1iMTEyLTM2YTM'
                'wNGI2NmRhZCIsImFpbyI6IkRZSmJVITNZWWhNWTliKjRJMk5mNXdXNGxyc3JaKjB2ZEZkWG16bHg2N0R0U0hRTmRhYnRKbTNrUjFLY'
                'kRVcVc1dVhzeDhjV0hrV0t0R1NxQ3lRNjZneFRhZVhUbEpiWWxMZzZtS3NSNFpITVlSeWhtYWhsOHMzTzZrZXF4MkxSU1JkaHMqUzB'
                'qOUZBSFNPR0RuN1NVUVUkIn0.p8jhPu_StpU1dCvc7-sKYPWUpcqUKAEGe9dLmTBJQbCkg_mVFwTPnUatd6yUSqQCe13b2wgg604KH'
                'HHqCSJ99ob_vrQColQ-RRht9y_tKMyRRiSMN82-zOSn3CSup-vPl_leeagJFsGqIrNyfaIle6rRwRbCBxd7zPPi6DmYdN76GBuwwQx'
                'd2BipoVgbq4uihdal-a8sqjGMkJffDxiJ6e9jcsV1j6o_B1DymRLK7IYnaxiyvx9nehHEdUwZLusE5ddUV6mCXc2bYFVPuX5p8FBTp'
                '0v3Kn6YZ5jyw1wEA6QdfLlEzqg9vbkaCbzmBcqZdjaBRVknY-MDm2CBN8asEQ',
    'refresh_token': 'M.R3_BAY.-Cf*5eLBDV3jz0wGVzPbODss2MugYAeiONnd1bCLzucl*!TwjFRH8qsJgGGGx9*xNr0W6z*gyTXbMdCcExD1ZvP!'
                     '4cZD5lqr9bqHiR!SZJDSm8cFG*ps8sBcUnA77091BEtPJqfoKnCn!OXjZXpjBp!DWEv7AMKM5df7RA!SugY7WEI4nmeFDAMEw'
                     'NALO95cPJ7gv6jDpKpnm4*jnxCF!1NYhh4j3MGT!QVw48ouUhr0reTCRshrkOGrNCWHQYJDs6KOsnp!*M*8cu1VLyb7oZVvLc'
                     'GQJhSGXrV0Dmijo5IWVod61lixqkg!hpiJoDXT91aQlsuUDK8TBpa2Oq!l0ZRY$',
    'scope': ['openid', 'profile', 'User.Read', 'Calendars.Read', 'User.ReadBasic.All'],
    'token_type': 'Bearer'
}


def get_token():
    if token:
        now = time.time()
        expire_time = token['expires_at'] - 300
        if now >= expire_time:
            aad_auth = OAuth2Session(settings['app_id'], token=token, scope=settings['scopes'],
                                     redirect_uri=settings['redirect'])

            refresh_params = {'client_id': settings['app_id'], 'client_secret': settings['app_secret']}
            new_token = aad_auth.refresh_token(token_url, **refresh_params)

            return new_token

        else:
            return token


def _get_user(post):
    email = post['email']
    token = get_token()
    graph_client = OAuth2Session(token=token)
    user = graph_client.get(f"https://graph.microsoft.com/v1.0/users?$filter=userPrincipalName eq '{email}'")
    if user.status_code == 200:
        user = user.json()
        res = {'email': email, 'userid': user[id], 'password1': post['password1'], 'password2': post['password2'],
               'username': post['username'], 'phoneno': user['mobilePhone']}
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
    return None


link = "mongodb://admin:4gWGjt4TLkdlZg1B@cluster0-shard-00-00.xrq2g.mongodb.net:27017,cluster0-shard-00-01.xrq2g.\
mongodb.net:27017,cluster0-shard-00-02.xrq2g.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-1fpp0j-shard\
-0&authSource=admin&retryWrites=true&w=majority"

dbclient = pymongo.MongoClient(link)
db = dbclient['thewebsite']


def sendmail(email, message):
    import smtplib, ssl

    port = 465  # For SSL
    smtp_server = "smtp.gmail.com"
    sender_email = "mushkilotp@gmail.com"  # Enter your address
    receiver_email = email  # Enter receiver address
    password = "69@vahi sochna mushkil hai69"

    context = ssl.create_default_context()
    with smtplib.SMTP_SSL(smtp_server, port, context=context) as server:
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
    db['otp'].insert({'email': email, 'otp': otp, 'created_at': datetime.datetime.utcnow()})
    Thread(target=_sendotp, args=(email, otp)).start()


def checkotp(email, otp):
    res = db['otp'].update({'email': email, 'otp': otp})
    if res:
        db['otp'].delete_one({'email': email, 'otp': otp})
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
    db['resettoken'].insert({'token': token, 'email': email, 'createdat': datetime.datetime.utcnow()})
    Thread(target=_send_reset_token, args=(email, token, host)).start()


def check_reset_token(token, change=False):
    res = db['resettoken'].find_one({'token': token})
    if res:
        if change:
            db['resettoken'].delete_one({'token': token})
        return res['email']
    return None
