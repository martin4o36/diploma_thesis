from django.urls import path
from ..views_dir.requests_views import *

urlpatterns = [
    path('<int:employee_id>/holiday/', GetEmployeeHolidayRequests.as_view(), name='get_employee_holiday_requests'),
    path('<int:approver_id>/holiday/pending/', GetHolidayPendingRequests.as_view(), name='get_employee_remote_requests'),
    path('add-holiday/', AddHolidayRequest.as_view(), name='add_employee_holiday_request'),
    path('edit-holiday/', EditHolidayRequest.as_view(), name='add_employee_holiday_request'),
    path('delete-holiday/', DeleteHolidayRequest.as_view(), name='add_employee_holiday_request'),
    path('<int:department_id>/substitutes/', GetSubstitutes.as_view(), name='get_employee_holiday_requests'),

    path('<int:employee_id>/remote/', GetEmployeeRemoteRequests.as_view(), name='get_employee_remote_requests'),
    path('<int:approver_id>/remote/pending/', GetRemotePendingRequests.as_view(), name='get_employee_remote_requests'),
    path('add-remote/', AddRemoteRequest.as_view(), name='add_employee_remote_request'),
    path('edit-remote/', EditRemoteRequest.as_view(), name='add_employee_remote_request'),
    path('delete-remote/', DeleteRemoteRequest.as_view(), name='add_employee_remote_request'),
]