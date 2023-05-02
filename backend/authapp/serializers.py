import re

from django.core.exceptions import ValidationError
from django.core.validators import validate_email

from djoser.serializers import UserSerializer as BaseUserSerializer
from djoser.serializers import TokenCreateSerializer as BaseTokenCreateSerializer
from djoser.serializers import UserCreatePasswordRetypeSerializer as BaseUserCreateSerializer

from rest_framework import serializers
from rest_framework.authtoken.models import Token

from .models import User


class UserCreateSerializer(BaseUserCreateSerializer):
    class Meta(BaseUserCreateSerializer.Meta):
        model = User
        fields = ('id', 'email', 'username', 'phone_no', 'password')

    def validate(self, attrs):
        if not re.match(r"(^\+?\d{12}$)|(^\d{10}$)", attrs["phone_no"]):
            raise serializers.ValidationError({"phone_no": "Invalid Phone number"})
        attrs['is_active'] = True # TODO: Remove in email verified
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


class TokenCreateSerializer(BaseTokenCreateSerializer):
    
    def validate(self, attrs):
        try:
            validate_email(attrs['email'])
        except ValidationError:
            raise serializers.ValidationError({'email': "Invalid Email Address"})
        
        return super().validate(attrs)
