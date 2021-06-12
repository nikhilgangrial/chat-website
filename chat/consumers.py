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
from datetime import datetime


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        user = self.scope['user']
        if user.is_authenticated:
            self.room_name = self.scope['url_route']['kwargs']['room_name']
            self.room_group_name = 'chat_%s' % self.room_name

            self.room_id = await self.validate_to_chat(user)

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
        return ChatRoom.objects.get_or_create(id=int(self.room_name))[0]
        # validate if user is allowed to acess chat

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
    async def receive(self, text_data=None, bytes_data=None):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

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
                # add line for user profile pic
            }
        )

    @database_sync_to_async
    def message_seen(self, message):
        message.seen_at = datetime.utcnow()
        message.save()

    async def delivery_report(self, event):
        userid = event['userid']

        if self.scope['user'].userid == userid:
            seen_at = str(event['seen_at'])
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
        # addline for user profile

        if not message_.seen_at and self.scope['user'].userid != userid:
            await self.message_seen(message_)
            # send delivey report to sender
            await self.channel_layer.group_send(self.room_group_name, {
                    'type': 'delivery_report',
                    'message': '',
                    'userid': userid,
                    'messageid': message_.id,
                    'seen_at': message_.seen_at,
                }
            )

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'type_': 'message',
            'message': message,
            'userid': userid,
            'username': username,
            'messageid': message_.id,
            'sent_at': str(message_.sent_at),    # TypeError: Object of type datetime is not JSON serializable
            'seen_at': str(message_.seen_at),
            # add code for user profile
        }))
