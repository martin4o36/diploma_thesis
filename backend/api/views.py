from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models_dir.employee_models import Employee, Department
from .models_dir.records_models import LeaveType
from rest_framework.response import Response
from .serializers.emp_dep_serializer import EmployeeSerializer, DepartmentSerializer, EmployeeHomeMenuSerializer, PermissionsSerializer
from .serializers.records_serializer import LeaveTypeSerializer

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
        

class GetDepartmentById(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, department_id):
        try:
            department = Department.objects.get(department_id=department_id)
            serializer = DepartmentSerializer(department)
            return Response(serializer.data)
        except Department.DoesNotExist:
            return Response({"error": "Department not found"}, status=404)
        

class LeaveTypeListView(APIView):
    def get(self, request):
        leave_types = LeaveType.objects.all()
        serializer = LeaveTypeSerializer(leave_types, many=True)
        return Response(serializer.data)
    

class PermissionsList(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            can_manage_employees = request.user.has_perm('api.crud_employee')
            serializer = PermissionsSerializer({"can_manage_employees": can_manage_employees})
            return Response(serializer.data)
        except Exception as e:
            return Response({"error": str(e)}, status=500)