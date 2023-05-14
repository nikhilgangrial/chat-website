from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics, permissions

from django.db.models import Q
from . import models, serializers

class ChatView(generics.ListCreateAPIView):

    def get_serializer_class(self):
        if self.request.method == "GET":
            return serializers.ChatSerializer
        elif self.request.method == "POST":
            return serializers.ChatCreateSerializer

    def get_queryset(self):
        if self.request.method == "GET":
            queryset = models.Chat.objects.filter(members__in=[self.request.user])
            search_query = self.request.GET.get('search')
            if search_query:
                queryset = queryset.filter(
                    Q(name__icontains=search_query) |
                    Q(members__email__icontains=search_query) |
                    Q(members__username__icontains=search_query)
                ).distinct()
            
            return queryset.all()

        elif self.request.method == "POST":
            return models.Chat.objects.all()

    filter_backends = [DjangoFilterBackend,]
    permission_classes = (permissions.IsAuthenticated, )
    
