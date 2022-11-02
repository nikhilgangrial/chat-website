from djongo import models as dmodels


class Array(dmodels.Model):
    user = dmodels.Field(primary_key=True, default=[])


class ChatRoom(dmodels.Model):
    id = dmodels.AutoField(primary_key=True, null=False)
    type = dmodels.CharField(default='dm', max_length=6)
    # noinspection PyUnresolvedReferences
    members = dmodels.ArrayField(model_container=Array, default=[])
    blocked = dmodels.ArrayField(model_container=Array, default=[])


class Messages(dmodels.Model):
    id = dmodels.AutoField(primary_key=True, null=False)
    roomid = dmodels.ForeignKey(ChatRoom, on_delete=dmodels.CASCADE)
    message = dmodels.TextField()
    sender = dmodels.TextField(default='')
    sent_at = dmodels.DateTimeField(auto_now_add=True)
    seen_at = dmodels.DateTimeField(default=None)
