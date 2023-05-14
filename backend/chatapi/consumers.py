import json

from asgiref.sync import async_to_sync

from . import models
from . import serializers

from rest_framework.authtoken.models import Token

from channels.generic.websocket import AsyncJsonWebsocketConsumer, WebsocketConsumer
from channels.db import database_sync_to_async
from datetime import datetime


class ChatConsumer(AsyncJsonWebsocketConsumer):

    @database_sync_to_async
    def get_chat(self, pk: int) -> models.Chat | None:
        try:
            chat = models.Chat.objects.get(id=pk)
            assert chat.members.filter(id=self.user.id).exists()
            return chat, list(chat.members.all())
        except AssertionError:
            return None, None

    @database_sync_to_async
    def validate_token(self, token: str) -> models.User | None:
        try:
            return Token.objects.get(key=token).user
        except:
            return None

    async def connect(self):
        self.user = None
        self.chat = None
        self.room_group_name = '-1'
        await self.accept()

    async def disconnect(self, code):
        # Leave room group
        if self.chat:
            await self.channel_layer.group_discard(
                self.room_group_name, self.channel_name
            )
            
    async def broadcast_send(self, content):
        for member in self.members:
            await self.channel_layer.group_send(str(member.id), {"type": "chat_message", "message": content['message']})

    # Receive message from WebSocket
    async def receive_json(self, content, **kwargs):
        action = content["action"]

        if action == 'authenticate':
            token = content["token"]
            self.user = await self.validate_token(token)
            
            if self.user:
                self.room_name = self.user.id
                self.room_group_name = str(self.user.id)
                
                await self.channel_layer.group_add(
                        self.room_group_name, self.channel_name
                    )
                await self.send_json({"type": "authenticate", "status": "success"})

        elif self.user and action == "chatregister":
            
            self.chat, self.members = await self.get_chat(content['chat'])
            if self.chat:
                await self.send_json({"type": "chatregister", "status": "success"})

        elif self.user and self.chat:
            match action:
                case "create":
                    message = await self.create_message(content)
                    await self.broadcast_send({"type": "chat_message", "message": message})
                case "update":
                    await self.channel_layer.group_send(self.room_group_name, {"type": "chat_message", "message": content['message']})
                case "delete":
                    await self.channel_layer.group_send(self.room_group_name, {"type": "chat_message", "message": content['message']})
                case _:
                    pass
                
    @database_sync_to_async
    def create_message(self, content):
        data = {
            "message": content["message"],
            "author": self.user,
            "chat": self.chat,
        }

        message = models.Message.objects.create(**data)
        message.save()
        
        self.chat.last_message = message
        self.chat.save()
        
        return serializers.MessageSerializer(message).data

    # Receive message from room group
    async def chat_message(self, event):
        message = event["message"]

        # Send message to WebSocket
        await self.send_json(content={ "type": "create",  "message": message })
