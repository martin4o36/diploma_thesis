from django.db import models
from enum import Enum
from .employee_models import Employee
from django.contrib import admin


# Create your models here.
class LeaveType(models.Model):
    leave_id = models.AutoField(primary_key=True)
    leave_name = models.CharField(max_length=255, null=False)
    days = models.IntegerField(null=False)

    class Meta:
        db_table = 'leave_types'


class EmployeeAllowance(models.Model):
    allowance_id = models.AutoField(primary_key=True)
    employee = models.ForeignKey(Employee, on_delete=models.DO_NOTHING)
    leave_type = models.ForeignKey(LeaveType, on_delete=models.DO_NOTHING)
    period_start_date = models.DateField(null=False)
    period_end_date = models.DateField(null=False)
    days = models.IntegerField(null=False)

    class Meta:
        db_table = 'employee_allowance'
        unique_together = ('employee', 'leave_type', 'period_start_date', 'period_end_date')


class WriteOff(models.Model):
    wo_id = models.AutoField(primary_key=True)
    employee = models.ForeignKey(Employee, on_delete=models.DO_NOTHING)
    employee_allowance = models.ForeignKey(EmployeeAllowance, on_delete=models.DO_NOTHING)
    days = models.IntegerField()

    class Meta:
        db_table = 'write_offs'


# Add saving for write offs(how many days and when a person has lost or got)


class EmployeeBalance(models.Model):
    eb_id = models.AutoField(primary_key=True)
    employee = models.ForeignKey(Employee, on_delete=models.DO_NOTHING)
    leave_type = models.ForeignKey(LeaveType, on_delete=models.DO_NOTHING)
    days_left = models.IntegerField(null=False)

    class Meta:
        db_table = 'employee_balances'


# Track how and when the balance changed


class Type(Enum):
    APPROVED = "Approved"
    WAITING = "Waiting"
    CANCELED = "Canceled"
    REJECTED = "Rejected"

    @classmethod
    def choices(cls):
        return [(key.name, key.value) for key in cls]
    


class Request(models.Model):
    request_id = models.AutoField(primary_key=True)
    employee = models.ManyToManyField(Employee, related_name='requests_employee')
    leave_type = models.ForeignKey(LeaveType, on_delete=models.DO_NOTHING)
    start_date = models.DateField()
    end_date = models.DateField()
    approver = models.OneToOneField(Employee, on_delete=models.DO_NOTHING, related_name='requests_approver')
    status = models.CharField(
        max_length=10,
        choices=Type.choices(),
        default=Type.WAITING.name
    )
    status_change = models.DateTimeField(null=False, auto_now=True)

    class Meta:
        db_table = 'requests'


class Substitute(models.Model):
    substitute_id = models.AutoField(primary_key=True)
    request = models.ForeignKey(Request, on_delete=models.DO_NOTHING)
    employee = models.ForeignKey(Employee, on_delete=models.DO_NOTHING)

    class Meta:
        db_table = 'substitutes'
        unique_together = ('request_id', 'employee_id')


admin.site.register(Request)
admin.site.register(LeaveType)
admin.site.register(EmployeeBalance)
admin.site.register(WriteOff)
admin.site.register(EmployeeAllowance)