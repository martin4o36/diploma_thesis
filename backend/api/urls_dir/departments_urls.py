from django.urls import path
from ..views_dir.department_views import DepartmentsChartView, DepartmentCreateView, EditDepartmentView

urlpatterns = [
    path('chart/', DepartmentsChartView.as_view(), name='get_departments_chart'),
    path('add/', DepartmentCreateView.as_view(), name='create_department'),
    path('<int:department_id>/edit/', EditDepartmentView.as_view(), name='edit_department'),
]