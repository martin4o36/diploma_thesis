# Generated by Django 5.1.4 on 2025-01-20 11:44

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0027_alter_holidayrequest_status_alter_remotework_status'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='holidayrequest',
            name='employee',
        ),
        migrations.AddField(
            model_name='holidayrequest',
            name='employee',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.DO_NOTHING, to='api.employee'),
            preserve_default=False,
        ),
    ]
