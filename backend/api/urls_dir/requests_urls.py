from django.urls import path
from ..views_dir.holiday_requests_views import *
from ..views_dir.remote_requests_views import *
from ..views_dir.other_requests_views import *

urlpatterns = [
    path('<int:employee_id>/holiday/', GetEmployeeHolidayRequests.as_view(), name='get_employee_holiday_requests'),
    path('<int:approver_id>/holiday/pending/', GetHolidayPendingRequests.as_view(), name='get_pending_holiday_requests'),
    path('add-holiday/', AddHolidayRequest.as_view(), name='add_employee_holiday_request'),
    path('<int:request_id>/edit-holiday/', EditHolidayRequest.as_view(), name='edit_employee_holiday_request'),
    path('<int:request_id>/cancel-holiday/', CancelHolidayRequest.as_view(), name='cancel_employee_holiday_request'),
    path('holiday/status/', UpdateHolidayStatus.as_view(), name='update_holiday_request_status'),

    path('<int:employee_id>/remote/', GetEmployeeRemoteRequests.as_view(), name='get_employee_remote_requests'),
    path('<int:approver_id>/remote/pending/', GetRemotePendingRequests.as_view(), name='get_pending_remote_requests'),
    path('add-remote/', AddRemoteRequest.as_view(), name='add_employee_remote_request'),
    path('<int:request_id>/edit-remote/', EditRemoteRequest.as_view(), name='edit_employee_remote_request'),
    path('<int:request_id>/cancel-remote/', CancelRemoteRequest.as_view(), name='cancel_remote_request'),
    path('remote/status/', UpdateRemoteStatus.as_view(), name='update_remote_request_status'),

    
    path('<int:employee_id>/my-pending/', GetEmployeePendingRequests.as_view(), name='get_employee_pending_requests'),
    path('<int:approver_id>/pending-approval/', GetPendingApprovalRequests.as_view(), name='get_pending_approval_requests'),
    path('<int:department_id>/events/', GetEventsForDepartment.as_view(), name='get_department_events'),
    path('<int:employee_id>/upcoming/', GetUpcomingRequests.as_view(), name='get_upcoming_requests'),
]