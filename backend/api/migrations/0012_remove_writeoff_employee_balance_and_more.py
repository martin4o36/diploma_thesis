# Generated by Django 5.1.4 on 2025-01-05 09:13

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0011_alter_employee_country'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='writeoff',
            name='employee_balance',
        ),
        migrations.DeleteModel(
            name='EmployeeBalance',
        ),
        migrations.DeleteModel(
            name='WriteOff',
        ),
    ]
