from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from ..models_dir.employee_models import Employee
from ..serializers.emp_dep_serializer import EmployeeSerializer, EmployeeHomeMenuSerializer

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
