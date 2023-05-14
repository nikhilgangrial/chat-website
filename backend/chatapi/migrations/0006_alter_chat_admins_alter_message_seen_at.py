# Generated by Django 4.2.1 on 2023-05-12 19:25

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('chatapi', '0005_alter_chat_admins_alter_chat_members'),
    ]

    operations = [
        migrations.AlterField(
            model_name='chat',
            name='admins',
            field=models.ManyToManyField(blank=True, related_name='group_admins', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='message',
            name='seen_at',
            field=models.DateTimeField(default=None, null=True),
        ),
    ]