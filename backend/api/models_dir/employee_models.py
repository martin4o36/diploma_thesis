from django.db import models
from django.contrib.auth.models import User
from django.contrib import admin
from enum import Enum


# Create your models here.
class Countries(models.Model):
    country_id = models.AutoField(primary_key=True)
    country_name = models.CharField(null=False)

    class Meta:
        db_table = 'countries'


class NonWorkingDay(models.Model):
    nwd_id = models.AutoField(primary_key=True)
    country = models.ForeignKey(Countries, on_delete=models.CASCADE)
    date = models.DateTimeField(null=False)
    description = models.TextField()

    class Meta:
        db_table = 'non_working_days'


class Status(Enum):
    ACTIVE = "Active"
    INACTIVE = "Inactive"
    LEFT = "Left"
    FIRED = "Fired"

    @classmethod
    def choices(cls):
        return [(key.name, key.value) for key in cls]


class Employee(models.Model):
    employee_id = models.AutoField(primary_key=True)
    user = models.OneToOneField(User, on_delete=models.DO_NOTHING, null=True, blank=True)
    first_name = models.CharField(max_length=200, null=False)
    middle_name = models.CharField(max_length=200, null=False)
    last_name = models.CharField(max_length=200, null=False)
    age = models.IntegerField()
    email = models.CharField(max_length=100, null=False)
    phone_number = models.CharField(max_length=15, null=True, blank=True)
    country = models.ForeignKey(Countries, on_delete=models.SET_NULL, null=True, blank=True)
    city = models.CharField(max_length=169)
    work_start = models.TimeField(null=False)
    work_end = models.TimeField(null=False)
    department_id = models.IntegerField(default=0)
    position = models.CharField(max_length=100, null=False)
    hired_date = models.DateField(null=False)
    left_date = models.DateField(null=True, blank=True)
    profile_picture = models.ImageField(upload_to='employees/', null=True, blank=True)
    status = models.CharField(
        max_length=10,
        choices=Status.choices(),
        null=True,
        blank=True,
        default=Status.ACTIVE.name
    )

    class RoleChoices(models.TextChoices):
        MANAGER = 'Manager', 'Manager'
        HR = 'HR', 'Human Resources'
        OWNER = 'Owner', 'Owner'

    roles = models.JSONField(
        default=list,
        help_text="List of roles assigned to the employee"
    )

    def has_role(self, role):
        """Check if the employee has the specified role."""
        return self.role == role
    
    def add_role(self, role):
        """Add a role to the employee if it doesn't already exist."""
        if role not in self.roles:
            self.roles.append(role)
            self.save()

    def remove_role(self, role):
        """Remove a role from the employee."""
        if role in self.roles:
            self.roles.remove(role)
            self.save()

    class Meta:
        db_table = 'employees'


class Department(models.Model):
    department_id = models.AutoField(primary_key=True)
    dep_name = models.CharField(max_length=200)
    parent_dept_id = models.IntegerField(default=0)
    manager = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        db_table = 'departments'


admin.site.register(Employee)
admin.site.register(Department)
admin.site.register(Countries)
admin.site.register(NonWorkingDay)