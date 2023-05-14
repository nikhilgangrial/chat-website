from rest_framework import serializers
from .. import models


class MessageSerializer(serializers.ModelSerializer):
     class Meta:
         model =models.Message
         fields = "__all__"
         read_only_fields = ["seen_at", "sent_at", "author", "chat"]
