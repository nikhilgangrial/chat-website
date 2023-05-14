import re
import base64
import uuid
import six
import imghdr

from django.core.files.base import ContentFile
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
            raise serializers.ValidationError(
                {"phone_no": "Invalid Phone number"})
        attrs['is_active'] = True  # TODO: Remove in email verified
        return super().validate(attrs)

    def to_representation(self, instance):
        data = super(UserCreateSerializer, self).to_representation(instance)
        user_tokens = Token.objects.get_or_create(user=instance)[0]
        data = {
            "success": "true",
            "user": data,
            "auth_token": str(user_tokens.key)
        }
        return data


class Base64ImageField(serializers.ImageField):

    def to_internal_value(self, data):

        if isinstance(data, six.string_types):
            if 'data:' in data and ';base64,' in data:
                header, data = data.split(';base64,')

            try:
                decoded_file = base64.b64decode(data)
            except TypeError:
                self.fail('invalid_image')

            file_name = str(uuid.uuid4())[:12] # 12 characters are more than enough.
            file_extension = self.get_file_extension(file_name, decoded_file)
            complete_file_name = "%s.%s" % (file_name, file_extension, )
            data = ContentFile(decoded_file, name=complete_file_name)

        return super(Base64ImageField, self).to_internal_value(data)

    def get_file_extension(self, file_name, decoded_file):

        extension = imghdr.what(file_name, decoded_file)
        return  "jpg" if extension == "jpeg" else extension

    
class UserSerializer(BaseUserSerializer):
    
    profile = Base64ImageField(max_length=None, use_url=True)
    cover = Base64ImageField(max_length=None, use_url=True)
    
    class Meta(BaseUserSerializer.Meta):
        model = User
        fields = ('id', 'email', 'username', 'phone_no', 'profile', 'cover')
        read_only_fields = ('id', 'email')

    
    def validate(self, attrs):
        if "phone_no" in attrs and not re.match(r"(^\+?\d{12}$)|(^\d{10}$)", attrs["phone_no"]):
            raise serializers.ValidationError({"phone_no": "Invalid Phone number"})
        attrs['is_active'] = True  # TODO: Remove in email verified
        return super().validate(attrs)


class TokenCreateSerializer(BaseTokenCreateSerializer):

    def validate(self, attrs):
        try:
            validate_email(attrs['email'])
        except ValidationError:
            raise serializers.ValidationError(
                {'email': "Invalid Email Address"})

        return super().validate(attrs)
