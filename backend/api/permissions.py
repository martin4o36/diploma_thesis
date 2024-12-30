from rest_framework.permissions import BasePermission
from rest_framework.exceptions import PermissionDenied
from .models_dir.employee_models import Employee
import logging

logger = logging.getLogger(__name__)

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

            logger.debug(f"Requesting user: {request.user}")
            logger.debug(f"Roles assigned to employee: {employee.roles}")

            if any(role in employee.roles for role in self.required_roles):
                return True
            else:
                logger.warning(f"Permission denied. User: {request.user} does not have one of the required roles: {self.required_roles}")
                raise PermissionDenied("You do not have the required permissions to access this resource.")
        except Employee.DoesNotExist:
            logger.warning(f"Permission denied. Employee not found for user: {request.user}")
            raise PermissionDenied("Employee not found.")
        

def HasRolePermissionWithRoles(required_roles):
    class DynamicRolePermission(HasRolePermission):
        def __init__(self):
            super().__init__(required_roles)
    
    return DynamicRolePermission