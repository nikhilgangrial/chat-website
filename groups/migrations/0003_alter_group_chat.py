# Generated by Django 3.2.4 on 2021-07-06 17:43

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0004_chatroom_title'),
        ('groups', '0002_auto_20210706_2310'),
    ]

    operations = [
        migrations.AlterField(
            model_name='group',
            name='chat',
            field=models.ForeignKey(default=None, null=True, on_delete=django.db.models.deletion.SET_NULL, to='chat.chatroom'),
        ),
    ]