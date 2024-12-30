from rest_framework import serializers
from ..models_dir.records_models import LeaveType, EmployeeAllowance, EmployeeBalance
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


class EmployeeAllowanceSerializer(serializers.ModelSerializer):
    leave_type_name = serializers.CharField(source="leave_type.leave_name", read_only=True)

    class Meta:
        model = EmployeeAllowance
        fields = [
            "allowance_id",
            "employee",
            "leave_type",
            "leave_type_name",
            "period_start_date",
            "period_end_date",
            "days",
            "bring_forward",
            "comment",
        ]


class EmployeeBalanceSerializer(serializers.ModelSerializer):
    leave_type_name = serializers.CharField(source="leave_type.leave_name", read_only=True)

    class Meta:
        model = EmployeeBalance
        fields = ["eb_id", "employee", "leave_type", "leave_type_name", "days_left"]