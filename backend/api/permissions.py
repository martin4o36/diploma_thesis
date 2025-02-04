from rest_framework.permissions import BasePermission
from rest_framework.exceptions import PermissionDenied
from .models_dir.employee_models import Employee

class HasRolePermission(BasePermission):
    """
    Custom permission to check if the employee has the required role.
    """

    def __init__(self, required_roles):
        if isinstance(required_roles, str):
            self.required_roles = [required_roles]
        else:
            self.required_roles = required_roles

    def has_permission(self, request, view):
        try:
            employee = Employee.objects.get(user=request.user)

            if any(role in employee.roles for role in self.required_roles):
                return True
            else:
                raise PermissionDenied("You do not have the required permissions to access this resource.")
        except Employee.DoesNotExist:
            raise PermissionDenied("Employee not found.")
        

def HasRolePermissionWithRoles(required_roles):
    class DynamicRolePermission(HasRolePermission):
        def __init__(self):
            super().__init__(required_roles)
    
    return DynamicRolePermission