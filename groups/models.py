from djongo import models as dmodels


class Array(dmodels.Model):
    user = dmodels.CharField(max_length=40, primary_key=True)
    power = dmodels.CharField(max_length=10, default="normal")


class Group(dmodels.Model):
    id = dmodels.AutoField(primary_key=True, null=False)
    type = dmodels.CharField(max_length=10, default="chat")
    name = dmodels.CharField(max_length=25, default="New Group")
    members = dmodels.ArrayField(model_container=Array, default=[])

    def __str__(self):
        return str(self.name)
