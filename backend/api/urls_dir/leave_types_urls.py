from django.urls import path
from ..views_dir.leave_views import LeaveTypeListView, LeaveTypeCreateView, LeaveTypeDeleteView, LeaveTypeEditView

urlpatterns = [
    path('', LeaveTypeListView.as_view(), name='leave_types'),
    path('add/', LeaveTypeCreateView.as_view(), name='create_leave_type'),
    path('<int:pk>/delete/', LeaveTypeDeleteView.as_view(), name='delete_leave_type'),
    path('<int:leave_id>/edit/', LeaveTypeEditView.as_view(), name='edit_leave_type'),
]