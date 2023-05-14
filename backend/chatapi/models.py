from django.db import models
from django.dispatch import receiver

from rest_framework.exceptions import ValidationError
from authapp.models import User

import os 


class Chat(models.Model):
    name = models.CharField(max_length=100, null=True, blank=True)
    profile = models.ImageField(upload_to="group_profile", null=True, blank=True)
    
    members = models.ManyToManyField(User, related_name="chat_members")
    admins = models.ManyToManyField(User, related_name='group_admins', blank=True)
    
    last_message = models.ForeignKey('Message', related_name="last_message", null=True, blank=True, on_delete=models.SET_NULL)
    
    is_group = models.BooleanField(default=False)


@receiver(models.signals.post_delete, sender=Chat)
def auto_delete_file_on_delete(sender, instance, **kwargs):

    if instance.profile:
        if os.path.isfile(instance.profile.path):
            os.remove(instance.profile.path)


@receiver(models.signals.pre_save, sender=Chat)
def auto_delete_file_on_change(sender, instance, **kwargs):
    if not instance.pk:
        return False

    try:
        chat = Chat.objects.get(pk=instance.pk)
    except Chat.DoesNotExist:
        return False

    if chat.profile and chat.profile != instance.profile:
        if os.path.isfile(chat.profile.path):
            os.remove(chat.profile.path)
            

class Message(models.Model):
    chat = models.ForeignKey(Chat, related_name="chat", on_delete=models.CASCADE)
    author = models.ForeignKey(User,related_name="author", null=True, on_delete=models.SET_NULL)
    message = models.TextField()
    sent_at = models.DateTimeField(auto_now_add=True)
    seen_at = models.DateTimeField(default=None, null=True)
