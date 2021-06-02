from django.db import models
# Create your models here.


class Users:
    username = models.CharField(max_length=40)
    password = models.CharField(max_length=16)