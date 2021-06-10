# Generated by Django 3.2.4 on 2021-06-10 16:30

import chat.models
from django.db import migrations, models
import django.db.models.deletion
import djongo.models.fields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='ChatRoom',
            fields=[
                ('roomid', models.AutoField(primary_key=True, serialize=False)),
                ('type', models.CharField(default='dm', max_length=6)),
                ('members', djongo.models.fields.ArrayField(model_container=chat.models.Array, null=True)),
                ('blocked', djongo.models.fields.ArrayField(model_container=chat.models.Array, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Messages',
            fields=[
                ('messageid', models.BigAutoField(primary_key=True, serialize=False)),
                ('message', models.TextField()),
                ('sent_at', models.DateTimeField(auto_now_add=True)),
                ('seen_at', models.DateTimeField(default=None)),
                ('roomid', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='chat.chatroom')),
            ],
        ),
    ]
