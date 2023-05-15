from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .serializers import UserSerializer
from .models import User


class UserListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer
    
    def get_queryset(self):
        search = self.request.query_params.get('search', '')        
        return User.objects.filter(email__icontains=search, username__icontains=search)
