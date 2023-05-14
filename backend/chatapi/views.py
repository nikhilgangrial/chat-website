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
                ).distinct().order_by('-last_message__sent_at')
            
            return queryset.all()

        elif self.request.method == "POST":
            return models.Chat.objects.all()

    filter_backends = [DjangoFilterBackend,]
    permission_classes = (permissions.IsAuthenticated, )
    
    
class SingleChatView(generics.RetrieveAPIView):
    permission_classes = (permissions.IsAuthenticated, )
    serializer_class = serializers.ChatSerializer
    
    def get_queryset(self):
        if self.request.method == "GET":
            queryset = models.Chat.objects.filter(members__in=[self.request.user])        
            return queryset.all()


class MessageView(generics.ListAPIView):
    serializer_class = serializers.MessageSerializer

    def get_queryset(self):
        chat_id = self.kwargs.get('chat_id')
        
        chat = models.Chat.objects.get(id=chat_id)
        try:
            assert chat.members.filter(id=self.request.user.id).exists()
        except AssertionError:
            raise serializers.ValidationError("You are not a member of this chat")

        return models.Message.objects.filter(chat__id=chat_id).order_by('-sent_at')

    permission_classes = (permissions.IsAuthenticated, )
