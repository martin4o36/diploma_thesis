from django.urls import path
from ..views_dir.department_views import *

urlpatterns = [
    path('chart/', DepartmentsChartView.as_view(), name='get_departments_chart'),
    path('<int:department_id>/events/', DepartmentsChartView.as_view(), name='get_departments_chart'),
    path('add/', DepartmentCreateView.as_view(), name='create_department'),
    path('<int:department_id>/edit/', EditDepartmentView.as_view(), name='edit_department'),
    path('<int:department_id>/delete/', DeleteDepartment.as_view(), name='delete_department'),
    path('', AllDepartments.as_view(), name='all_department'),
    path('<int:department_id>/profile/', DepartmentsForProfile.as_view(), name='departments_structured_to_employee_department'),
]