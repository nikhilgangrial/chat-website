from djongo import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager


# manager for our custom model
class MyAccountManager(BaseUserManager):
    """
        This is a manager for Account class
    """

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Users must have an Email address")
        if not extra_fields['username']:
            raise ValueError("Users must have an Username")
        user = self.model(email=self.normalize_email(email), **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password, **extra_fields):
        user = self.create_user(email=self.normalize_email(email), password=password, **extra_fields)
        user.is_admin = True
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


# noinspection PyUnusedLocal
class Users(AbstractBaseUser):
    """
      Custom user class inheriting AbstractBaseUser class
    """
    id = models.AutoField(primary_key=True, null=False)
    email = models.EmailField(verbose_name='email', max_length=60, unique=True)
    username = models.CharField(max_length=65)
    phone_no = models.CharField(max_length=13, default='')
    date_joined = models.DateTimeField(verbose_name='date joined', auto_now_add=True)
    is_admin = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_superuser = models.BooleanField(default=False)
    status = models.CharField(max_length=10, default="offline")
    profile = models.CharField(max_length=30, default="")
    cover = models.CharField(max_length=30, default="")

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    objects = MyAccountManager()

    # def __str__(self):
    #     return self.username

    def has_perm(self, perm, obj=None):
        return self.is_admin

    # noinspection PyMethodMayBeStatic
    def has_module_perms(self, app_label):
        return True
