import os
from datetime import date
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from ..models_dir.employee_models import Employee
from ..models_dir.records_models import LeaveType, EmployeeAllowance, EmployeeBalance
from ..serializers.emp_dep_serializer import EmployeeSerializer, EmployeeHomeMenuSerializer, EmployeeBalanceSerializer
from ..models_dir.employee_models import Countries
from django.contrib.auth.models import User
from django.contrib.auth.decorators import permission_required


class GetCurrentUserToManage(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            employee = Employee.objects.get(user=request.user)
            serializer = EmployeeSerializer(employee)
            return Response(serializer.data, status=200)
        except Employee.DoesNotExist:
            return Response({"error": "Employee not found"}, status=404)


class GetCurrentUserToManageForHomeMenu(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            employee = Employee.objects.get(user=request.user)
            serializer = EmployeeHomeMenuSerializer(employee)
            return Response(serializer.data, status=200)
        except Employee.DoesNotExist:
            return Response({"error": "Employee not found"}, status=404)
    
    
class GetEmployeesByDepartmentID(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            department_id = request.data.get('department_id')
            if not department_id:
                return Response({"error": "Department ID is required"}, status=400)
            
            employees = Employee.objects.filter(department_id=department_id)
            serializer = EmployeeSerializer(employees, many=True)
            return Response(serializer.data, status=200)
        except:
            return Response({"error": "Employees for department not found"}, status=404)
        

# @permission_required(raise_exception=True)
class GetAllEmployees(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            employees = Employee.objects.all()
            serializer = EmployeeBalanceSerializer(employees, many=True)
            return Response(serializer.data, status=200)
        except Exception as e:
            return Response({"error:" : "Employees not found"}, status=400)
        

# @permission_required(raise_exception=True)
class CreateEmployee(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        employee_data = request.data
        first_name = employee_data.get('first_name')
        last_name = employee_data.get('last_name')
        password = employee_data.get('password')
        country_id = employee_data.get('country')

        if not first_name or not last_name or not password or not country_id:
            return Response({"error": "Missing required fields"}, status=400)
        
        print("PROFILE PICTURE: ", request.FILES.get('profile_picture', None))
        print("LEFT DATE: ", employee_data.get('left_date'))

        try:
            country = Countries.objects.get(country_id=country_id)

            employee = Employee.objects.create(
                first_name=first_name,
                middle_name=employee_data.get('middle_name'),
                last_name=last_name,
                age=employee_data.get('age'),
                email=employee_data.get('email'),
                phone_number=employee_data.get('phone_number'),
                country=country,
                city=employee_data.get('city'),
                work_start=employee_data.get('work_start'),
                work_end=employee_data.get('work_end'),
                department_id=employee_data.get('department_id'),
                manager_id=employee_data.get('manager_id'),
                position=employee_data.get('position'),
                hired_date=employee_data.get('hired_date'),
            )

            employee.save()

            user = User.objects.create_user(
                username=f"{first_name.lower()}_{employee.middle_name.lower()}_{last_name.lower()}",
                password=password
            )

            employee.user=user
            employee.save()

            if request.FILES.get('profile_picture'):
                profile_picture = request.FILES['profile_picture']
                new_filename = f"profile_picture_{employee.employee_id}.{profile_picture.name.split('.')[-1]}"
                file_path = os.path.join('employees/', new_filename)
                file = ContentFile(profile_picture.read())
                default_storage.save(file_path, file)
                print("FILE PATH:", file_path)

                employee.profile_picture = file_path
                employee.save()

            createEmployeeAllowancesBalances(employee=employee)

            return Response({"message": "Employee created successfully", "employee_id": employee.employee_id}, status=201)

        except Countries.DoesNotExist:
            return Response({"error": "Country not found"}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=500)
        

# @permission_required(raise_exception=True)
class DeleteEmployee(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        pass


# @permission_required(raise_exception=True)
class EditEmployee(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        pass


def createEmployeeAllowancesBalances(employee):
    leave_types = LeaveType.objects.all()
    current_year = date.today().year
    period_start_date = date(current_year, 1, 1)
    period_end_date = date(current_year, 12, 31)

    for leave_type in leave_types:
        EmployeeAllowance.objects.create(
            employee=employee,
            leave_type=leave_type,
            period_start_date=period_start_date,
            period_end_date=period_end_date,
            days=leave_type.days,
            bring_forward=leave_type.default_bring_forward_days
        )

        EmployeeBalance.objects.create(
            employee=employee,
            leave_type=leave_type,
            days_left=leave_type.days
        )