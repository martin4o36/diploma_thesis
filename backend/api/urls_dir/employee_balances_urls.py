from django.urls import path
from ..views_dir.employee_balances_views import GetBalancesForEmployee

urlpatterns = [
    path("<int:employee_id>/", GetBalancesForEmployee.as_view(), name="get_balances_for_employee"),
]