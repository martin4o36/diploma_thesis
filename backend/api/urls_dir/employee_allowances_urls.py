from django.urls import path
from ..views_dir.employee_allowances_views import GetAllowancesForEmployee

urlpatterns = [
    path("<int:employee_id>/", GetAllowancesForEmployee.as_view(), name="get_allowances_for_employee"),
]