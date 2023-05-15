from .. import models
from authapp.serializers import UserSerializer

from rest_framework import serializers

from .messageserializers import MessageSerializer

class ChatSerializer(serializers.ModelSerializer):

    members = UserSerializer(many=True)
    last_message = MessageSerializer(read_only=True)

    class Meta:
        model = models.Chat
        fields = "__all__"

    def to_representation(self, instance):
        rep = super().to_representation(instance)

        if not instance.is_group:
            members = list(instance.members.all())
            
            i = 1 - int((len(members) == 1 or members[0] != self.context['request'].user))

            rep['name'] = members[i].username
            rep['profile'] =  self.context['request'].build_absolute_uri(members[i].profile.url) if members[i].profile else None

        if rep['last_message'] == None:
            rep['last_message'] = { 'sent_at': '0000-00-00T00:00:00.000000Z'}
            
        return rep


class ChatCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Chat
        fields = "__all__"

    def validate(self, attrs):
        attrs = super().validate(attrs)
        
        if 'is_group' not in attrs:
            attrs['is_group'] = False
        if 'members' not in attrs:
            raise serializers.ValidationError({'members': 'This field is required.'})
        
        attrs['members'] += [self.context['request'].user]
        members = set(attrs.get('members'))
        
        if attrs['is_group'] == False:
            queryset = models.Chat.objects.filter(is_group=False, members__in=members)
            qs = list(queryset)
            for i in set(qs):
                if qs.count(i) == len(members) and len(i.members.all()) == len(members):
                    raise serializers.ValidationError({
                        "non_field_errors": ["A chat with the same members already exists."],
                        "chat": ChatSerializer(i, context=self.context).data
                    })

        return attrs
