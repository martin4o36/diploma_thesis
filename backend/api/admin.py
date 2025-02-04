from django.contrib import admin
from .models import *

# Register your models here.
admin.site.register(Employee)
admin.site.register(Department)
admin.site.register(Countries)
admin.site.register(NonWorkingDay)
admin.site.register(HolidayRequest)
admin.site.register(RemoteWork)
admin.site.register(LeaveType)
admin.site.register(EmployeeLeaveBalance)
admin.site.register(WriteOff)
admin.site.register(Substitute)