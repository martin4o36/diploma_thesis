from django.contrib import admin
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from api.views import GetCurrentUserToManage, GetDepartmentById, LeaveTypeListView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token', TokenObtainPairView.as_view(), name='get_token'),
    path('api/token/refresh', TokenRefreshView.as_view(), name='refresh_token'),
    path("api/employee", GetCurrentUserToManage.as_view(), name="get_employee"),
    path('api/departments/<int:department_id>/', GetDepartmentById.as_view(), name='get_department_by_id'),
    path('api/leave-types/', LeaveTypeListView.as_view(), name="leave-types")
]