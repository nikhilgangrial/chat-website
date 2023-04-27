import os

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models
from django.dispatch import receiver


# manager for our custom model
class MyAccountManager(BaseUserManager):
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
class User(AbstractBaseUser):
    id = models.AutoField(primary_key=True, null=False)

    email = models.EmailField(verbose_name='email', max_length=60, unique=True)
    username = models.CharField(max_length=65)

    phone_no = models.CharField(max_length=13, unique=True)
    date_joined = models.DateTimeField(verbose_name='date joined', auto_now_add=True)

    is_admin = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)

    profile = models.ImageField(upload_to="profile", null=True, blank=True)
    cover = models.ImageField(upload_to="cover", null=True, blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    objects = MyAccountManager()

    def __str__(self):
        return self.username

    def has_perm(self, perm, obj=None):
        return self.is_admin

    # noinspection PyMethodMayBeStatic
    def has_module_perms(self, app_label):
        return True


@receiver(models.signals.post_delete, sender=User)
def auto_delete_file_on_delete(sender, instance, **kwargs):
    """
    Deletes file from filesystem
    when corresponding `MediaFile` object is deleted.
    """
    if instance.profile:
        if os.path.isfile(instance.profile.path):
            os.remove(instance.profile.path)

    if instance.cover:
        if os.path.isfile(instance.cover.path):
            os.remove(instance.cover.path)


@receiver(models.signals.pre_save, sender=User)
def auto_delete_file_on_change(sender, instance, **kwargs):
    """
    Deletes old file from filesystem
    when corresponding `MediaFile` object is updated
    with new file.
    """
    if not instance.pk:
        return False

    try:
        user = User.objects.get(pk=instance.pk)
    except User.DoesNotExist:
        return False

    if user.profile and user.profile != instance.profile:
        if os.path.isfile(user.profile.path):
            os.remove(user.profile.path)

    if user.cover and user.cover != instance.cover:
        if os.path.isfile(user.cover.path):
            os.remove(user.cover.path)
