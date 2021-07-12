"""
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from datetime import datetime


class Messenger(AsyncWebsocketConsumer):

    async def connect(self):
        user = self.scope['user']
        if user.isauthenticated:
            pass
        else:
            await self.close()

    def disconnect(self, code):
        if code == 1001:
            await self.go_offline()
        self.close()

    @database_sync_to_async
    def go_offline(self):
        user = self.scope['user']
        user.is_active = False
        user.last_login = datetime.utcnow()
        user.save()

"""

# chat/consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from chat.models import Messages, ChatRoom
from login_reg.models import Users
from datetime import datetime


async def remove_br(message):
    print(message)
    while 1:
        if message[-4:] == '<br>':
            message = message[:-4]
        elif message[-6:] == '&nbsb;':
            message = message[:-6]
        elif message[-1:] == ' ':
            message = message[:-1]
        elif message[-15:] == '<div><br></div>':
            message = message[:-15]
        else:
            break

    while 1:
        if message[:4] == '<br>':
            message = message[4:]
        elif message[:6] == '&nbsb;':
            message = message[6:]
        elif message[:1] == ' ':
            message = message[1:]
        elif message[:15] == '<div><br></div>':
            message = message[15:]
        else:
            break

    return message.strip()


class ChatConsumer(AsyncWebsocketConsumer):
    # noinspection PyAttributeOutsideInit
    async def connect(self):
        user = self.scope['user']
        if user.is_authenticated:
            self.room_name = self.scope['url_route']['kwargs']['room_name']
            self.room_group_name = 'chat_%s' % self.room_name

            self.room_id = await self.validate_to_chat(user)

            if not self.room_id:
                await self.close()

            # Join room group
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
            await self.go_online(user)
            await self.accept()
        else:
            await self.close()

    @database_sync_to_async
    def validate_to_chat(self, user):   # check line 45 too
        try:
            return ChatRoom.objects.get(id=int(self.room_name), members={'user': user.userid})
        except:
            return False

    @database_sync_to_async
    def go_online(self, user):
        user.status = 'online'
        user.save()

    @database_sync_to_async
    def go_offline(self, user):
        user.status = 'offline'
        user.save()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        await self.close()
        await self.go_offline(self.scope['user'])

    @database_sync_to_async
    def write_message(self, message):
        message_ = Messages.objects.create(message=message, sent_at=datetime.utcnow(), roomid=self.room_id,
                                           sender=self.scope['user'].userid)
        return message_

    # Receive message from WebSocket
    # noinspection PyAttributeOutsideInit
    async def receive(self, text_data=None, bytes_data=None):
        text_data_json = json.loads(text_data)

        # Normal message received
        if text_data_json['type_'] == "message":
            message = text_data_json['message'].strip()
            message = await remove_br(message)
            if message:
                message_ = await self.write_message(message)
                # Send message to room group
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'chat_message',
                        'message': message,
                        'message_': message_,
                        'userid': self.scope['user'].userid,
                        'username': self.scope['user'].username,
                        'profile': self.scope['user'].profile,
                    }
                )

        # Message delete request
        elif text_data_json['type_'] == 'delete':
            mess_id = text_data_json['mess_id']
            userid = self.scope['user'].userid
            res = await self.del_message_from_db(mess_id, userid)
            if res:
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'deleted_message',
                        'mess_id': mess_id,
                    }
                )

        # Multiple Message Delete Request
        elif text_data_json['type_'] == 'delete_multi':
            print(datetime.now())
            mess_ids = text_data_json['mess_ids']
            userid = self.scope['user'].userid
            res = await self.del_multi_messages_from_db(mess_ids, userid)
            if res:
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'deleted_multi',
                        'mess_ids': mess_ids,
                    }
                )

        elif text_data_json['type_'] == "switchroom":
            print(text_data_json['room'])
            old_room = self.room_name
            self.room_name = str(text_data_json['room'])
            roomid = await self.validate_to_chat(self.scope['user'])
            if roomid:
                self.room_id = roomid
                print(self.room_id)
                await self.channel_layer.group_discard(
                    self.room_group_name,
                    self.channel_name
                )
                self.room_group_name = 'chat_%s' % self.room_name
                await self.channel_layer.group_add(
                    self.room_group_name,
                    self.channel_name
                )
                await self.send(text_data=json.dumps({
                    'type_': 'switchroom',
                    'room': self.room_name,
                }))
            else:
                self.room_name = old_room
        elif text_data_json['type_'] == "load_chats":
            chats = await self.load_chats()
            await self.send(text_data=json.dumps({
                "type_": "load_chats",
                "chats": str(chats),
            }))

    @database_sync_to_async
    def load_chats(self):
        userid = self.scope['user'].userid
        chats = ChatRoom.objects.filter(members={'user': userid})
        response = []
        for chat in chats:
            response.append({})
            response[-1]['chatid'] = chat.id
            response[-1]['type'] = chat.type
            if chat.type == "dm":
                try:
                    if chat.members[0]['user'] == userid:
                        other = Users.objects.get(userid=chat.members[1]['user'])
                    else:
                        other = Users.objects.get(userid=chat.members[0]['user'])
                except:     #case deleted user
                    other = object()
                    other.__dict__ = {'profile': "", 'username': "<i>Deleted User</i>", 'status': "offline"}
                response[-1]['av'] = other.profile
                response[-1]['title'] = other.username
                response[-1]['status'] = other.status
            elif chat.type == "group":
                grp = chat.title
                response[-1]['av'] = grp.av
                response[-1]['title'] = grp.name
                response[-1]['status'] = 'blank'
        return response

    @database_sync_to_async
    def del_multi_messages_from_db(self, mess_ids, userid):
        try:
            Messages.objects.filter(sender=userid, id__in=mess_ids).delete()
            return True
        except:
            return False

    async def deleted_multi(self, event):
        await self.send(text_data=json.dumps({
            'type_': 'deleted_multi',
            'message_ids': event['mess_ids']
        }))
        print(datetime.now())

    async def deleted_message(self, event):
        await self.send(text_data=json.dumps({
            'type_': 'deleted',
            'messageid': event['mess_id'],
        }))

    @database_sync_to_async
    def del_message_from_db(self, mess_id, userid):
        try:
            Messages.objects.get(id=mess_id, sender=userid).delete()
            return True
        except:
            return False

    @database_sync_to_async
    def message_seen(self, message):
        message.seen_at = datetime.utcnow()
        message.save()

    async def delivery_report(self, event):
        userid = event['userid']

        if self.scope['user'].userid == userid:
            seen_at = event['seen_at']
            await self.send(text_data=json.dumps({
                'type_': 'delivery_report',
                'messageid': event['messageid'],
                'seen_at': seen_at,
            }))

    # Receive message from room group
    async def chat_message(self, event):
        message = event['message']
        userid = event['userid']
        username = event['username']
        message_ = event['message_']
        profile = event['profile']

        if not message_.seen_at and self.scope['user'].userid != userid:
            await self.message_seen(message_)
            # send delivey report to sender
            await self.channel_layer.group_send(self.room_group_name, {
                    'type': 'delivery_report',
                    'message': '',
                    'userid': userid,
                    'messageid': message_.id,
                    'seen_at': str(message_.seen_at),
                    'profile': profile,
                }
            )

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'type_': 'message',
            'message': message,
            'userid': userid,
            'username': username,
            'messageid': message_.id,
            'sent_at': str(message_.sent_at),
            'seen_at': str(message_.seen_at),
            'profile': profile,
        }))
