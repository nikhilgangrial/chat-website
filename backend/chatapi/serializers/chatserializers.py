from .. import models
from authapp.serializers import UserSerializer

from rest_framework import serializers


class ChatSerializer(serializers.ModelSerializer):

    members = UserSerializer(many=True)

    class Meta:
        model = models.Chat
        fields = "__all__"

    def to_representation(self, instance):
        rep = super().to_representation(instance)

        def url_from_file(value):
            try:
                print(value.__dict__)
                url = value.url
            except:
                return None
            request = self.context.get('request', None)
            if request is not None:
                return request.build_absolute_uri(url)
            return url

        if not instance.is_group:
            members = list(instance.members.all())
            
            i = 1 - int((len(members) == 1 or members[0] != self.context['request'].user))

            rep['name'] = members[i].username
            rep['profile'] =  self.context['request'].build_absolute_uri(members[i].profile.url) if members[i].profile else None

        return rep


class ChatCreateSerializer(ChatSerializer):

    class Meta:
        model = models.Chat
        fields = "__all__"

    def validate(self, attrs):
        attrs['members'] += [self.context['request'].user]
        members = set(attrs.get('members'))
        if members:
            queryset = models.Chat.objects.filter(members__in=members)
            qs = list(queryset)
            for i in set(qs):
                if qs.count(i) == len(members):
                    raise serializers.ValidationError(
                        "A chat with the same members already exists.")

        return super().validate(attrs)
