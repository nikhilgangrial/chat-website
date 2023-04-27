import requests
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView


class Activate(APIView):
    def get(self, request, *args, **kwargs):
        try:
            uid = kwargs.get('uid')
            token = kwargs.get('token')
            result = requests.post(url='http://127.0.0.1:8000/auth/users/activation/',
                                   data={'uid': uid, 'token': token})
            message = result.text
            return Response(message, result.status_code)
        except Exception as e:
            return Response(str(e), status.HTTP_400_BAD_REQUEST)
