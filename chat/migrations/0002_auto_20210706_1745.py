# Generated by Django 3.2.4 on 2021-07-06 12:15

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='chatroom',
            old_name='roomid',
            new_name='id',
        ),
        migrations.RenameField(
            model_name='messages',
            old_name='messageid',
            new_name='id',
        ),
    ]