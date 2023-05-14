# Generated by Django 4.2.1 on 2023-05-14 09:50

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('chatapi', '0006_alter_chat_admins_alter_message_seen_at'),
    ]

    operations = [
        migrations.AddField(
            model_name='chat',
            name='last_message',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='last_message', to='chatapi.message'),
        ),
    ]
