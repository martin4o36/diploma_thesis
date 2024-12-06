from django.urls import path
from ..views_dir.department_views import GetDepartmentById, DepartmentsChartView, DepartmentsListView, DepartmentCreateView

urlpatterns = [
    path('api/departments/<int:department_id>/', GetDepartmentById.as_view(), name='get_department_by_id'),
    path('api/departments_chart/', DepartmentsChartView.as_view(), name='get_departments_chart'),
    path('api/departments/', DepartmentsListView.as_view(), name='get_all_departments'),
    path('api/add_department/', DepartmentCreateView.as_view(), name='create_department'),

    # From the above move everything to what is down
    path('<int:department_id>/', GetDepartmentById.as_view(), name='get_department_by_id'),
    path('chart/', DepartmentsChartView.as_view(), name='get_departments_chart'),
    path('', DepartmentsListView.as_view(), name='get_all_departments'),
    path('add/', DepartmentCreateView.as_view(), name='create_department'),
]