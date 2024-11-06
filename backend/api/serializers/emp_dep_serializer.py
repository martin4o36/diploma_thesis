from rest_framework import serializers
from django.conf import settings
from ..models_dir.employee_models import Employee, Department

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = '__all__'


class EmployeeHomeMenuSerializer(serializers.ModelSerializer):
    profile_picture = serializers.SerializerMethodField()

    class Meta:
        model = Employee
        fields = ['first_name', 'last_name', 'profile_picture']

    def get_profile_picture(self, obj):
        if obj.profile_picture:
            return settings.MEDIA_URL + obj.profile_picture.name
        return None


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'