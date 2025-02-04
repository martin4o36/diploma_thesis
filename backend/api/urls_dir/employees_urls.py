from django.urls import path
from django.conf.urls.static import static
from django.conf import settings
from ..views_dir.employee_views import *

urlpatterns = [
    path('', GetCurrentEmployeeToManage.as_view(), name='get_employee'),
    path('<int:department_id>/by-department/', GetEmployeesByDepartmentID.as_view(), name='get_employees_by_department'),
    path('<int:department_id>/manager/', GetManagerForDepartment.as_view(), name='get_manager_for_department'),
    path('all/', GetAllActiveEmployees.as_view(), name='get_all_employees'),

    path('add/', CreateEmployee.as_view(), name='add_employee'),
    path('no-department/', GetEmployeesNoDepartment.as_view(), name='get_employees_with_no_department'),
    path('by-status/', GetEmployeeByStatus.as_view(), name='get_employees_by_status'),
    path('<int:employee_id>/edit/', EditEmployee.as_view(), name='edit_employee'),
    path('<int:employee_id>/delete/', DeleteEmployee.as_view(), name='delete_employee'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)