# Generated by Django 4.2 on 2023-04-27 12:49

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('authapp', '0003_alter_user_cover_userprofile'),
    ]

    operations = [
        migrations.DeleteModel(
            name='UserProfile',
        ),
    ]