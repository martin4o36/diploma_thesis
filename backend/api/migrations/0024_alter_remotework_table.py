# Generated by Django 5.1.4 on 2025-01-10 12:15

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0023_rename_request_holidayrequest_and_more'),
    ]

    operations = [
        migrations.AlterModelTable(
            name='remotework',
            table='remote_requests',
        ),
    ]
