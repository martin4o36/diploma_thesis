from rest_framework import serializers
from django.conf import settings
from ..models_dir.employee_models import Employee, Department
from django.contrib.auth.models import User
from ..models_dir.employee_models import Countries

class EmployeeSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Employee
        fields = '__all__'

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        username = f"{validated_data['first_name']}_{validated_data['middle_name']}_{validated_data['last_name']}"
        user = User.objects.create_user(username=username, password=password)
        
        employee = Employee.objects.create(user=user, **validated_data)
        return employee


class EmployeeHomeMenuSerializer(serializers.ModelSerializer):
    profile_picture = serializers.SerializerMethodField()

    class Meta:
        model = Employee
        fields = ['first_name', 'last_name', 'profile_picture']

    def get_profile_picture(self, obj):
        if obj.profile_picture:
            return settings.MEDIA_URL + obj.profile_picture.name
        return None
    

class EmployeeBalanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ['employee_id', 'first_name', 'middle_name', 'last_name', 'position']


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'

    def validate_parent_dept_id(self, value):
        if value != 0 and not Department.objects.filter(department_id=value).exists():
            raise serializers.ValidationError("Parent department does not exist.")
        return value


class PermissionsSerializer(serializers.Serializer):
    can_manage_employees = serializers.BooleanField()


class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Countries
        fields = '__all__'

    def validate_country_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("Country name cannot be empty or whitespace.")
        return value