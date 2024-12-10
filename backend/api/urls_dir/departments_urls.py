from django.urls import path
from ..views_dir.department_views import DepartmentsChartView, DepartmentCreateView

urlpatterns = [
    path('chart/', DepartmentsChartView.as_view(), name='get_departments_chart'),
    path('add/', DepartmentCreateView.as_view(), name='create_department'),
]