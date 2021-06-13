from login_reg.models import Users
from chat.models import ChatRoom, Messages
from datetime import datetime


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
            sender = Users.objects.get(userid=i.sender)
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
