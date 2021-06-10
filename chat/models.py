from djongo import models as dmodels


class Array(dmodels.Model):
    value = dmodels.Field()

    class Meta:
        abstract = True


class ChatRoom(dmodels.Model):
    roomid = dmodels.AutoField(primary_key=True)
    type = dmodels.CharField(default='dm', max_length=6)
    members = dmodels.ArrayField(model_container=Array, null=True)
    blocked = dmodels.ArrayField(model_container=Array, null=True)


class Messages(dmodels.Model):
    roomid = dmodels.ForeignKey(ChatRoom, on_delete=dmodels.CASCADE)
    messageid = dmodels.BigAutoField(primary_key=True)
    message = dmodels.TextField()
    sent_at = dmodels.DateTimeField(auto_now_add=True)
    seen_at = dmodels.DateTimeField(default=None)
