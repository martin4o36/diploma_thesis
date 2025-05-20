from django.db import models
from enum import Enum
from .employee_models import Employee


# Create your models here.
class LeaveType(models.Model):
    leave_id = models.AutoField(primary_key=True)
    leave_name = models.CharField(max_length=255, null=False)
    days = models.IntegerField(null=False)
    default_bring_forward_days = models.FloatField(null=True, blank=True, default=0)

    class Meta:
        db_table = 'leave_types'


class EmployeeLeaveBalance(models.Model):
    balance_id = models.AutoField(primary_key=True)
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    leave_type = models.ForeignKey(LeaveType, on_delete=models.CASCADE)
    period_start_date = models.DateField(null=False)
    period_end_date = models.DateField(null=False)
    days = models.FloatField(null=False)
    bring_forward = models.IntegerField(null=True, blank=True)
    days_used = models.FloatField(default=0)
    comment = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        db_table = 'employee_leave_balances'
        unique_together = ('employee', 'leave_type', 'period_start_date', 'period_end_date')

    @property
    def days_left(self):
        return self.days + (self.bring_forward if self.bring_forward is not None else 0) - self.days_used
    
    def use_days(self, days: float):
        if days > self.days_left:
            raise ValueError("Not enough leave balance.")
        self.days_used += days
        self.save()


# Add saving for write offs(how many days a person has lost or got at the end of his period time)
class WriteOff(models.Model):
    wo_id = models.AutoField(primary_key=True)
    date_updated = models.DateTimeField(auto_now_add=True)
    employee_balance = models.ForeignKey(EmployeeLeaveBalance, on_delete=models.DO_NOTHING)
    initial_days = models.IntegerField(default=0)
    days_brought_forward = models.IntegerField(default=0)
    days_lost = models.IntegerField(default=0)

    class Meta:
        db_table = 'write_offs'


class Type(Enum):
    APPROVED = "Approved"
    PENDING = "Pending"
    CANCELED = "Canceled"
    REJECTED = "Rejected"

    @classmethod
    def choices(cls):
        return [(key.name, key.value) for key in cls]
    


class HolidayRequest(models.Model):
    request_id = models.AutoField(primary_key=True)
    employee = models.ForeignKey(Employee, on_delete=models.DO_NOTHING)
    leave_type = models.ForeignKey(LeaveType, on_delete=models.DO_NOTHING)
    start_date = models.DateField()
    end_date = models.DateField()
    approver = models.ForeignKey(Employee, on_delete=models.DO_NOTHING, related_name='requests_approver')
    status = models.CharField(
        max_length=10,
        choices=Type.choices(),
        default=Type.PENDING.name
    )
    status_change = models.DateTimeField(null=False, auto_now=True)
    comment = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        db_table = 'holiday_requests'


class Substitute(models.Model):
    substitute_id = models.AutoField(primary_key=True)
    request = models.ForeignKey(HolidayRequest, on_delete=models.DO_NOTHING)
    employee = models.ForeignKey(Employee, on_delete=models.DO_NOTHING)

    class Meta:
        db_table = 'substitutes'
        unique_together = ('request_id', 'employee_id')


class RemoteWork(models.Model):
    remote_id = models.AutoField(primary_key=True)
    employee = models.ForeignKey(Employee, on_delete=models.DO_NOTHING, related_name='remote_employee')
    start_date = models.DateField()
    end_date = models.DateField()
    approver = models.ForeignKey(Employee, on_delete=models.DO_NOTHING, related_name='remote_approver')
    status = models.CharField(
        max_length=10,
        choices=Type.choices(),
        default=Type.PENDING.name
    )
    status_change = models.DateTimeField(null=False, auto_now=True)
    comment = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        db_table = 'remote_requests'
