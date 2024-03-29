# Generated by Django 4.2 on 2023-04-27 12:19

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('authapp', '0002_remove_user_is_verified'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='cover',
            field=models.ImageField(null=True, upload_to='cover'),
        ),
        migrations.CreateModel(
            name='UserProfile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('websiteUrl', models.URLField(blank=True, null=True)),
                ('facebookUrl', models.URLField(blank=True, null=True)),
                ('twitterUrl', models.URLField(blank=True, null=True)),
                ('telegramUrl', models.URLField(blank=True, null=True)),
                ('linkedinUrl', models.URLField(blank=True, null=True)),
                ('youtubeUrl', models.URLField(blank=True, null=True)),
                ('date_joined', models.DateTimeField(auto_now_add=True)),
                ('updated_on', models.DateTimeField(auto_now=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='user_profile', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
