from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from ..models_dir.employee_models import Department, Employee
from ..serializers.emp_dep_serializer import DepartmentSerializer
from ..permissions import HasRolePermissionWithRoles


class DepartmentsChartView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            departments = Department.objects.all()
            org_data = generate_org_data(departments)
            return Response(org_data)
        except Exception as e:
            return Response({"error": str(e)}, status=500)


class DepartmentCreateView(APIView, HasRolePermissionWithRoles(['Owner', 'HR'])):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        serializer = DepartmentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    


def build_department_tree(departments, parent_id=0):
    tree = []
    for department in departments:
        if department["parent_dept_id"] == parent_id:
            children = build_department_tree(departments, department["department_id"])
            tree.append({
                "department_id": department["department_id"],
                "dep_name": department["dep_name"],
                "manager" : department["manager"],
                "parent_dept_id": department["parent_dept_id"],
                "children": children,
            })
    return tree


def generate_org_data(departments):
    departments = list(departments.values('department_id', 'dep_name', 'parent_dept_id', 'manager__first_name', 'manager__last_name', 'manager_id'))

    def build_tree(parent_id):
        return [
            {
                "key": str(dept["department_id"]),
                "title": dept["dep_name"],
                "manager": {
                    "name": f"{dept['manager__first_name']} {dept['manager__last_name']}" if dept["manager__first_name"] else None,
                    "id": dept["manager_id"] if dept["manager_id"] else None,
                },
                "children": build_tree(dept["department_id"]),
            }
            for dept in departments if dept["parent_dept_id"] == parent_id
        ]

    tree = build_tree(0)
    return tree


class EditDepartmentView(APIView, HasRolePermissionWithRoles(['Owner', 'HR'])):
    permission_classes = [IsAuthenticated, ]

    def put(self, request, department_id):
        try:
            department = Department.objects.get(department_id=department_id)
            print(department)
        except Department.DoesNotExist:
            return Response({"error": "Department not found."}, status=404)
        
        department_name = request.data.get("dep_name")
        manager_id = request.data.get("manager_id")

        if department_name:
            department.dep_name = department_name

        if manager_id is not None:
            if manager_id == "":
                department.manager = None
            else:
                try:
                    manager = Employee.objects.get(employee_id=manager_id)
                    print(manager)
                    department.manager = manager
                except Employee.DoesNotExist:
                    return Response({"error": "Manager not found."}, status=400)
            
        department.save()
        
        serializer = DepartmentSerializer(department)
        return Response({"message": "Department updated successfully.", "data": serializer.data}, status=200)
    

class DeleteDepartment(APIView, HasRolePermissionWithRoles(['Owner', 'HR'])):
    permission_classes = [IsAuthenticated, HasRolePermissionWithRoles(['Owner', 'HR'])]

    def delete(self, request):
        pass