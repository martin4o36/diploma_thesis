from rest_framework import serializers
from ..models_dir.records_models import LeaveType

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