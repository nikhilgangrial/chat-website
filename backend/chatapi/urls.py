# chatapi/urls.py
from django.urls import path

from . import views

urlpatterns = [
    path('chat/', views.ChatView.as_view()),
    path('chat/<int:pk>/', views.SingleChatView.as_view()),
    path('message/<int:chat_id>/', views.MessageView.as_view())
]
