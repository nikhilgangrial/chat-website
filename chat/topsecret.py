from login_reg.models import Users
from chat.models import ChatRoom, Messages
from datetime import datetime
from libs.imgur_python import Imgur


class Empty:
    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)


def convert_message(q, user):
    res = []
    senders = {user.userid: user}   # keepings track of users to avoid reloading same data from database

    for i in q:
        if i.sender != user.userid and not i.seen_at:
            i.seen_at = datetime.utcnow()
            i.save()

        if i.sender in senders:
            sender = senders[i.sender]
        else:
            try:
                sender = Users.objects.get(userid=i.sender)
            except:
                sender = Empty(username='<i style="color: inherit;">Deleted User</i>', userid=i.sender)
            senders[i.sender] = sender

        res.append({
            "message": i.message,
            "sent_at": i.sent_at,
            "seen_at": i.seen_at,
            "sender": sender.username,
            "senderid": sender.userid,
            "id": i.id,
            # TODO: Add code for profile pic
        })

    if len(res) == 51:
        return res[:50], 200
    else:
        return res, 201


def get_messages(user, room, start):
    src = ChatRoom.objects.get(id=int(room))
    """
    if user not in src.members:   # TODO: check is user is allowed to acess chat  
        return None, 400
    """
    start = int(start)
    if start == 0:
        q = Messages.objects.filter(roomid=src).order_by("-id")[:51]
    else:
        q = Messages.objects.filter(roomid=src, id__lt=start).order_by("-id")[:51]
    return convert_message(q, user)


title = 'Untitled'
album = None
disable_audio = 0
imgur_client = Imgur({'client_id': 'c08f2a8d367a13c',
                      'client_secret': '342c02d21ce4dc76ef1538daaf5099cf80925366',
                      'access_token': '4b65ba39c8d6db6b5cb5865dd03803529de38e90',
                      'expires_in': 315360000,
                      'expires_at': 1907657196.758331,
                      'token_type': 'bearer',
                      'refresh_token': 'b2caaaab2d3beff57b63810accc4b12da7f98c46'
                      })


def upload_image(file, f=None, _type=None):
    imgur_client.access_token()
    response = imgur_client.image_upload(file, title, "",  album, disable_audio, f=f, _type=_type)
    return response
