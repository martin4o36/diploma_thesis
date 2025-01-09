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


class DepartmentCreateView(APIView):
    permission_classes = [IsAuthenticated, HasRolePermissionWithRoles(['Owner', 'HR'])]
    
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


class EditDepartmentView(APIView):
    permission_classes = [IsAuthenticated, HasRolePermissionWithRoles(['Owner', 'HR'])]

    def put(self, request, department_id):
        try:
            department = Department.objects.get(department_id=department_id)
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
    

class DeleteDepartment(APIView):
    permission_classes = [IsAuthenticated, HasRolePermissionWithRoles(['Owner', 'HR'])]

    def delete(self, request, department_id):
        try:
            def delete_department_and_children(dept_id):
                child_departments = Department.objects.filter(parent_dept_id=dept_id)

                for child in child_departments:
                    delete_department_and_children(child.department_id)

                Employee.objects.filter(department_id=dept_id).update(department_id=0)
                Department.objects.filter(department_id=dept_id).delete()

            delete_department_and_children(department_id)
            return Response({"message": "Department and its child departments deleted successfully."}, status=200)
        except Exception as e:
            return Response({"error": str(e)}, status=500)


class AllDepartments(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            departments = Department.objects.all()
            serializer = DepartmentSerializer(departments, many=True)
            return Response(serializer.data, status=200)
        except Exception as e:
            return Response({"error": str(e)}, status=500)
        

class DepartmentsForProfile(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, department_id):
        try:
            departments_chain = []
            current_dept = Department.objects.get(department_id=department_id)
            manager_info = {}

            if current_dept.manager:
                manager = current_dept.manager
                manager_info = {
                    "first_name": manager.first_name,
                    "last_name": manager.last_name,
                    "position": manager.position,
                    "profile_picture": manager.profile_picture.url if manager.profile_picture else None,
                    "email": manager.email,
                    "phone_number": manager.phone_number,
                }

            while current_dept.parent_dept_id != 0:
                departments_chain.append(current_dept)
                current_dept = Department.objects.get(department_id=current_dept.parent_dept_id)

            departments_chain.append(current_dept)
            departments_data = DepartmentSerializer(departments_chain, many=True).data

            response_data = {
                "departments_chain": departments_data,
                "manager_info": manager_info,
            }
            return Response(response_data, status=200)
        except Department.DoesNotExist:
            return Response({"error": "Department not found"}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=500)