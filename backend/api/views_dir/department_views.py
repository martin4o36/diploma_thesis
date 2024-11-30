from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from ..models_dir.employee_models import Department
from ..serializers.emp_dep_serializer import DepartmentSerializer
from ..utils import generate_org_data

class GetDepartmentById(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, department_id):
        try:
            department = Department.objects.get(department_id=department_id)
            serializer = DepartmentSerializer(department)
            return Response(serializer.data)
        except Department.DoesNotExist:
            return Response({"error": "Department not found"}, status=404)


class DepartmentsChartView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            departments = Department.objects.all()
            org_data = generate_org_data(departments)
            return Response(org_data)
        except Exception as e:
            return Response({"error": str(e)}, status=500)


class DepartmentsListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            departments = Department.objects.all()
            serializer = DepartmentSerializer(departments, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({"error": str(e)}, status=500)


class DepartmentCreateView(APIView):
    def post(self, request):
        serializer = DepartmentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
