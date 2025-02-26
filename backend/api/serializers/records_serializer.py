from rest_framework import serializers
from ..models_dir.records_models import LeaveType, EmployeeLeaveBalance, HolidayRequest, RemoteWork, Substitute
from ..models_dir.employee_models import NonWorkingDay

class LeaveTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeaveType
        fields = '__all__'

    def validate_days(self, value):
        if value <= 0:
            raise serializers.ValidationError("Days must be a positive integer.")
        return value
    
    def validate_leave_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("Leave name cannot be empty or whitespace.")
        return value
    

class NonWorkingDaySerializer(serializers.ModelSerializer):
    class Meta:
        model = NonWorkingDay
        fields = '__all__'
        read_only_fields = ['nwd_id', 'country']


class EmployeeLeaveBalanceSerializer(serializers.ModelSerializer):
    leave_type_name = serializers.CharField(source="leave_type.leave_name", read_only=True)
    # brought_forward = serializers.CharField() # will add it soon

    class Meta:
        model = EmployeeLeaveBalance
        fields = [
            "balance_id",
            "employee",
            "leave_type",
            "leave_type_name",
            "period_start_date",
            "period_end_date",
            "days",
            "days_used",
            "bring_forward",
            "comment",
        ]


class SubstituteSerializer(serializers.ModelSerializer):
    employee_name = serializers.SerializerMethodField()

    class Meta:
        model = Substitute
        fields = [
            "substitute_id",
            "employee",
            "employee_name",
        ]

    def get_employee_name(self, obj):
        return f"{obj.employee.first_name} {obj.employee.last_name}"


class HolidayRequestSerializer(serializers.ModelSerializer):
    approver_name = serializers.SerializerMethodField()
    leave_type_name = serializers.CharField(source="leave_type.leave_name", read_only=True)
    substitutes = serializers.SerializerMethodField()

    class Meta:
        model = HolidayRequest
        fields = [
            "request_id",
            "employee",
            "leave_type",
            "leave_type_name",
            "start_date",
            "end_date",
            "approver",
            "approver_name",
            "status",
            "status_change",
            "comment",
            "substitutes",
        ]

    def get_approver_name(self, obj):
        if obj.approver:
            return f"{obj.approver.first_name} {obj.approver.last_name}"
        return None
    
    def get_substitutes(self, obj):
        substitutes = Substitute.objects.filter(request=obj)
        return SubstituteSerializer(substitutes, many=True).data
    

class HolidayPendingSerializer(serializers.ModelSerializer):
    leave_type_name = serializers.CharField(source="leave_type.leave_name", read_only=True)
    employee_name = serializers.SerializerMethodField()
    substitutes = serializers.SerializerMethodField()

    class Meta:
        model = HolidayRequest
        fields = [
            "request_id",
            "employee",
            "employee_name",
            "leave_type",
            "leave_type_name",
            "start_date",
            "end_date",
            "approver",
            "status",
            "status_change",
            "comment",
            "substitutes",
        ]

    def get_substitutes(self, obj):
        substitutes = Substitute.objects.filter(request=obj)
        return SubstituteSerializer(substitutes, many=True).data
    
    def get_employee_name(self, obj):
        if obj.employee:
            middle_name = obj.employee.middle_name or ""
            return f"{obj.employee.first_name} {middle_name} {obj.employee.last_name}"
        return None


class RemoteWorkSerializer(serializers.ModelSerializer):
    approver_name = serializers.SerializerMethodField()
    employee_name = serializers.SerializerMethodField()

    class Meta:
        model = RemoteWork
        fields = [
            "remote_id",
            "employee",
            "employee_name",
            "start_date",
            "end_date",
            "approver",
            "status",
            "status_change",
            "comment",
            "approver_name",
        ]

    def get_approver_name(self, obj):
        if obj.approver:
            return f"{obj.approver.first_name} {obj.approver.last_name}"
        return None
    
    def get_employee_name(self, obj):
        if obj.employee:
            middle_name = obj.employee.middle_name or ""
            return f"{obj.employee.first_name} {middle_name} {obj.employee.last_name}"
        return None