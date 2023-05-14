from rest_framework import serializers
from .. import models
from authapp.serializers import UserSerializer


class MessageSerializer(serializers.ModelSerializer):
    author = UserSerializer()
    
    class Meta:
        model = models.Message
        fields = "__all__"
        read_only_fields = ["seen_at", "sent_at", "author", "chat"]
