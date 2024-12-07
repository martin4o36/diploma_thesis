from django.urls import path
from ..views_dir.department_views import GetDepartmentById, DepartmentsChartView, DepartmentsListView, DepartmentCreateView

urlpatterns = [
    path('api/departments/<int:department_id>/', GetDepartmentById.as_view(), name='get_department_by_id'),

    path('<int:department_id>/', GetDepartmentById.as_view(), name='get_department_by_id'),
    path('chart/', DepartmentsChartView.as_view(), name='get_departments_chart'),
    path('', DepartmentsListView.as_view(), name='get_all_departments'),
    path('add/', DepartmentCreateView.as_view(), name='create_department'),
]