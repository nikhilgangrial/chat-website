from djongo import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager


# manager for our custom model
class MyAccountManager(BaseUserManager):
    """
        This is a manager for Account class
    """

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Users must have an Emaill address")
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


class Users(AbstractBaseUser):
    """
      Custom user class inheriting AbstractBaseUser class
    """
    userid = models.CharField(max_length=26, unique=True)
    email = models.EmailField(verbose_name='email', max_length=60, unique=True)
    username = models.CharField(max_length=65)
    phoneno = models.CharField(max_length=13, default='')
    type = models.CharField(max_length=10)
    rollno = models.IntegerField()
    stu_class = models.CharField(max_length=15)  # class is python keyword
    year = models.CharField(max_length=2)
    regno = models.IntegerField()
    date_joined = models.DateTimeField(verbose_name='date joined', auto_now_add=True)
    is_admin = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    status = models.CharField(max_length=10, default="offline")
    profile = models.CharField(max_length=30, default="")

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'userid']

    objects = MyAccountManager()

    def __str__(self):
        return self.username

    def has_perm(self, perm, obj=None):
        return self.is_admin

    def has_module_perms(self, app_label):
        return True
