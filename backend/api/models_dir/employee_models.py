from django.db import models
from django.contrib.auth.models import User
from django.contrib import admin


# Create your models here.
class Countries(models.Model):
    country_id = models.AutoField(primary_key=True)
    country_name = models.CharField(null=False)

    class Meta:
        db_table = 'countries'


class NonWorkingDays(models.Model):
    nwd_id = models.AutoField(primary_key=True)
    country = models.ForeignKey(Countries, on_delete=models.CASCADE)
    date = models.DateTimeField(null=False)
    description = models.TextField()

    class Meta:
        db_table = 'non_working_days'


class Department(models.Model):
    department_id = models.AutoField(primary_key=True)
    dep_name = models.CharField(max_length=200)
    parent_dept_id = models.IntegerField(default=0)

    class Meta:
        db_table = 'departments'


class Employee(models.Model):
    employee_id = models.AutoField(primary_key=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=200, null=False)
    last_name = models.CharField(max_length=200, null=False)
    age = models.IntegerField()
    email = models.CharField(max_length=100, null=False)
    country = models.OneToOneField(Countries, on_delete=models.CASCADE)
    city = models.CharField(max_length=169)
    work_start = models.TimeField(null=False)
    work_end = models.TimeField(null=False)
    department_id = models.IntegerField(default=0)
    manager_id = models.IntegerField(default=0)
    position = models.CharField(max_length=100, null=False)
    hired_date = models.DateField(null=False)
    left_date = models.DateField()
    profile_picture = models.ImageField(upload_to='employees/')

    class Meta:
        db_table = 'employees'
        permissions = [
        ("crud_employees_leave-types_departments", "Can add, update and delete an employee"),
        ("export_records", "Can add, update and delete an employee"),
        ]


admin.site.register(Employee)
admin.site.register(Department)
admin.site.register(Countries)
admin.site.register(NonWorkingDays)