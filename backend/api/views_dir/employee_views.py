from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from ..models_dir.employee_models import Employee
from ..serializers.emp_dep_serializer import EmployeeSerializer, EmployeeHomeMenuSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from ..models_dir.employee_models import Countries

class GetCurrentUserToManage(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            employee = Employee.objects.get(user=request.user)
            serializer = EmployeeSerializer(employee)
            return Response(serializer.data)
        except Employee.DoesNotExist:
            return Response({"error": "Employee not found"}, status=404)


class GetCurrentUserToManageForHomeMenu(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            employee = Employee.objects.get(user=request.user)
            serializer = EmployeeHomeMenuSerializer(employee)
            return Response(serializer.data)
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
        

class CreateEmployee(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        employee_data = request.data
        print("REQUEST DATA: ", employee_data)
    
    

def mapCountryFromRequestToObject(country_id):
    try:
        country = Countries.objects.get(pk=country_id)
        return country
    except Countries.DoesNotExist:
        raise ValueError(f"Country with ID '{country_id}' does not exist.")
