# Generated by Django 5.1.4 on 2025-01-05 14:44

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0017_alter_employeebalance_period_end_date_and_more'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='employeebalance',
            unique_together={('employee', 'leave_type', 'period_start_date', 'period_end_date')},
        ),
    ]
