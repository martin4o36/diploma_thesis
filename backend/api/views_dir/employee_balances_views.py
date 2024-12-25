from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.decorators import permission_required
from ..models_dir.employee_models import Employee
from ..models_dir.records_models import EmployeeBalance
from ..serializers.records_serializer import EmployeeBalanceSerializer


class GetBalancesForEmployee(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, employee_id):
        try:
            employee = Employee.objects.get(employee_id=employee_id)
            balances = EmployeeBalance.objects.filter(employee=employee)
            serializer = EmployeeBalanceSerializer(balances, many=True)
            return Response(serializer.data, status=200)
        except Exception as e:
            return Response({"error": "Fetching balances for employee failed"}, status=404)