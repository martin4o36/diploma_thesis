from django.urls import path
from django.conf.urls.static import static
from django.conf import settings
from ..views_dir.employee_views import *

urlpatterns = [
    path('', GetCurrentUserToManage.as_view(), name='get_employee'),
    path('home/', GetCurrentUserToManageForHomeMenu.as_view(), name='get_home_menu_employee'),
    path('add/', CreateEmployee.as_view(), name='add_employee'),
    path('<int:departmentId>/by-department/', GetEmployeesByDepartmentID.as_view(), name='get_employees_by_department'),
    path('all/', GetAllEmployees.as_view(), name='get_all_employees'),
    path('no-department/', GetEmployeesNoDepartment.as_view(), name='get_all_employees'),
    path('<int:employee_id>/edit/', EditEmployee.as_view(), name='get_all_employees'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)