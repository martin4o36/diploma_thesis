import os
from datetime import date
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from ..models_dir.employee_models import Employee, Status, Department
from ..models_dir.records_models import LeaveType, EmployeeLeaveBalance
from ..serializers.emp_dep_serializer import EmployeeSerializer
from ..models_dir.employee_models import Countries
from django.contrib.auth.models import User
from ..permissions import HasRolePermissionWithRoles

class GetCurrentEmployeeToManage(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            employee = Employee.objects.get(user=request.user)
            serializer = EmployeeSerializer(employee)
            return Response(serializer.data, status=200)
        except Employee.DoesNotExist:
            return Response({"error": "Employee not found"}, status=404)

    
class GetEmployeesByDepartmentID(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, department_id):
        try:
            employees = Employee.objects.filter(department_id=department_id, status = Status.ACTIVE.name)
            serializer = EmployeeSerializer(employees, many=True)
            return Response(serializer.data, status=200)
        except Employee.DoesNotExist:
            return Response({"error": "Employees for department not found"}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=500)
        

class GetManagerForDepartment(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, reques, department_id):
        try:
            department = Department.objects.get(department_id=department_id)
            manager = department.manager
            serializer = EmployeeSerializer(manager)
            return Response(serializer.data, status=200)
        except Exception as e:
            return Response({"error": str(e)}, status=500)

        

class GetAllActiveEmployees(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            employees = Employee.objects.filter(status = Status.ACTIVE.name)
            serializer = EmployeeSerializer(employees, many=True)
            return Response(serializer.data, status=200)
        except Exception as e:
            return Response({"error:" : "Employees not found"}, status=400)
        

class GetEmployeesNoDepartment(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            employees = Employee.objects.filter(department_id = 0, status = Status.ACTIVE.name)
            serializer = EmployeeSerializer(employees, many=True)
            return Response(serializer.data, status=200)
        except Exception as e:
            return Response({"error:" : "Employees without department not found"}, status=400)
        

class GetEmployeeByStatus(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, status_name):
        pass
        

class CreateEmployee(APIView):
    permission_classes = [IsAuthenticated, HasRolePermissionWithRoles(['Owner', 'HR'])]

    def post(self, request):
        employee_data = request.data
        first_name = employee_data.get('first_name')
        last_name = employee_data.get('last_name')
        password = employee_data.get('password')
        country_id = employee_data.get('country')
        grant_hr_access = employee_data.get('grant_hr_access', 'false').lower() == 'true'

        if not first_name or not last_name or not password or not country_id:
            return Response({"error": "Missing required fields"}, status=400)

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

                employee.profile_picture = file_path
                employee.save()

            if grant_hr_access:
                employee.add_role("HR")

            employee.save()
            createEmployeeAllowancesBalances(employee=employee)
            return Response({"message": "Employee created successfully", "employee_id": employee.employee_id}, status=201)
        except Countries.DoesNotExist:
            return Response({"error": "Country not found"}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=500)


def createEmployeeAllowancesBalances(employee):
    leave_types = LeaveType.objects.all()
    current_year = date.today().year
    period_start_date = date(current_year, 1, 1)
    period_end_date = date(current_year, 12, 31)

    for leave_type in leave_types:
        EmployeeLeaveBalance.objects.create(
            employee=employee,
            leave_type=leave_type,
            period_start_date=period_start_date,
            period_end_date=period_end_date,
            days=leave_type.days,
            bring_forward=leave_type.default_bring_forward_days
        )


class DeleteEmployee(APIView):
    permission_classes = [IsAuthenticated, HasRolePermissionWithRoles(['Owner', 'HR'])]

    def delete(self, request, employee_id):
        try:
            employee = Employee.objects.get(employee_id=employee_id)
            employee.status = Status.INACTIVE.name
            
            if employee.user:
                user = employee.user
                employee.user = None
                employee.save()
                user.delete()

            employee.save()
            return Response({"message": "Employee deleted successfully"}, status=200)
        except Exception as e:
            return Response({"error": str(e)}, status=500)


class EditEmployee(APIView):
    permission_classes = [IsAuthenticated, HasRolePermissionWithRoles(['Owner', 'HR'])]

    def put(self, request, employee_id):
        try:
            employee = Employee.objects.get(employee_id=employee_id)
        except Employee.DoesNotExist:
            return Response({"error": "Employee not found"}, status=404)
        
        try:
            country_id = request.data.get('country')
            country = Countries.objects.get(country_id=country_id)
        except Countries.DoesNotExist:
            return Response({"error": "Country not found"}, status=404)
        
        employee_data = request.data
        first_name = employee_data.get('first_name', employee.first_name)
        middle_name = employee_data.get('middle_name', employee.middle_name)
        last_name = employee_data.get('last_name', employee.last_name)
        age = employee_data.get('age', employee.age)
        email = employee_data.get('email', employee.email)
        phone_number = employee_data.get('phone_number', employee.phone_number)
        country_id = employee_data.get('country', employee.country_id)
        city = employee_data.get('city', employee.city)
        work_start = employee_data.get('work_start', employee.work_start)
        work_end = employee_data.get('work_end', employee.work_end)
        department_id = employee_data.get('department_id', employee.department_id)
        position = employee_data.get('position', employee.position)
        hired_date = employee_data.get('hired_date', employee.hired_date)
        left_date = employee_data.get('left_date', employee.left_date)
        if left_date == "":
            left_date = None
        grant_hr_access = employee_data.get('grant_hr_access', 'false').lower() == 'true'
        
        
        employee.first_name = first_name
        employee.middle_name = middle_name
        employee.last_name = last_name
        employee.age = age
        employee.email = email
        employee.phone_number = phone_number
        employee.country = country
        employee.city = city
        employee.work_start = work_start
        employee.work_end = work_end
        employee.department_id = department_id
        employee.position = position
        employee.hired_date = hired_date
        employee.left_date = left_date

        if request.FILES.get('profile_picture'):
            # employee.profile_picture = handle_profile_picture_upload(employee, request.FILES['profile_picture'])

            profile_picture = request.FILES['profile_picture']
            new_filename = f"profile_picture_{employee.employee_id}.{profile_picture.name.split('.')[-1]}"
            file_path = os.path.join('employees/', new_filename)
            file = ContentFile(profile_picture.read())
            default_storage.save(file_path, file)
            employee.profile_picture = file_path

        if grant_hr_access:
            employee.add_role("HR")
        else:
            employee.remove_role("HR")

        employee.save()
        return Response({"message": "Employee updated successfully"}, status=200)
    

def handle_profile_picture_upload(employee, pofile_picture):
    pass