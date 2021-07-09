# Generated by Django 3.2.4 on 2021-07-06 17:34

from django.db import migrations, models
import djongo.models.fields
import groups.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Group',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('type', models.CharField(default='chat', max_length=10)),
                ('name', models.CharField(default='New Group', max_length=25)),
                ('members', djongo.models.fields.ArrayField(default=[], model_container=groups.models.Array)),
                ('chat_members', djongo.models.fields.ArrayField(default=[], model_container=groups.models.Array)),
            ],
        ),
    ]
