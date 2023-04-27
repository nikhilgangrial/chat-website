import re

from djoser.serializers import UserCreatePasswordRetypeSerializer as BaseUserCreateSerializer
from djoser.serializers import UserSerializer as BaseUserSerializer
from rest_framework import serializers
from rest_framework.authtoken.models import Token

from .models import User


class UserCreateSerializer(BaseUserCreateSerializer):
    class Meta(BaseUserCreateSerializer.Meta):
        model = User
        fields = ('id', 'email', 'username', 'phone_no', 'password')

    def validate(self, attrs):
        if not re.match(r"(^\+?\d{12}$)|(^\d{10}$)", attrs["phone_no"]):
            raise serializers.ValidationError("Invalid Phone number")
        return super().validate(attrs)

    def to_representation(self, instance):
        data = super(UserCreateSerializer, self).to_representation(instance)
        user_tokens = Token.objects.get_or_create(user=instance)[0]
        tokens = {'token': str(user_tokens.key)}
        data = {
            "success": "true",
            "data": data | tokens
        }
        return data


class UserSerializer(BaseUserSerializer):
    class Meta(BaseUserSerializer.Meta):
        model = User
        fields = ('id', 'email', 'username', 'phone_no', 'profile', 'cover')
        read_only_fields = ('id', 'email', 'phone_no')
