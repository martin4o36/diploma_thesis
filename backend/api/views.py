from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from .models_dir.employee_models import Employee

class GetUserRoles(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            employee = Employee.objects.get(user=request.user)
            return Response({"roles": employee.roles}, status=200)
        except Employee.DoesNotExist:
            raise PermissionDenied("Employee not found.")