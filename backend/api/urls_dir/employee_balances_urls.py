from django.urls import path
from ..views_dir.employee_balances_views import *

urlpatterns = [
    path('<int:employee_id>/', GetAllLeaveBalancesForEmployee.as_view(), name='get_leave_balances_for_employee'),
    path('<int:employee_id>/leave-type/<int:leave_id>/', GetLeaveBalanceForEmployee.as_view(), name='get_leave_balances_for_employee'),
    path('<int:leave_balance_id>/edit/', EditLeaveBalance.as_view(), name='edit_leave_balance'),
    path('<int:leave_balance_id>/delete/', DeleteLeaveBalances.as_view(), name='delete_leave_balance'),
    path('add/', CreateLeaveBalance.as_view(), name='create_leave_balance'),
]