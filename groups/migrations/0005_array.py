# Generated by Django 3.2.4 on 2021-07-06 18:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('groups', '0004_remove_group_chat'),
    ]

    operations = [
        migrations.CreateModel(
            name='Array',
            fields=[
                ('user', models.CharField(max_length=40, primary_key=True, serialize=False)),
                ('power', models.CharField(default='normal', max_length=10)),
            ],
        ),
    ]