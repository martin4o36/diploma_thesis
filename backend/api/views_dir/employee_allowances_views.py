from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.decorators import permission_required
from ..models_dir.records_models import EmployeeAllowance, EmployeeBalance
from ..models_dir.employee_models import Employee
from ..serializers.records_serializer import EmployeeAllowanceSerializer

class GetAllowancesForEmployee(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, employee_id):
        try:
            employee = Employee.objects.get(employee_id=employee_id)
            print("EMPLOYEE: ", employee)
            allowances = EmployeeAllowance.objects.filter(employee=employee)
            print("ALLOWANCE: ", allowances)
            serializer = EmployeeAllowanceSerializer(allowances, many=True)
            return Response(serializer.data, status=200)
        except Exception:
            return Response({"error": "Fetching allowances for employee failed"}, status=404)