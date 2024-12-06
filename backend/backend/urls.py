from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from api.views import *

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token', TokenObtainPairView.as_view(), name='get_token'),
    path('api/token/refresh', TokenRefreshView.as_view(), name='refresh_token'),
    path('api/employee', GetCurrentUserToManage.as_view(), name='get_employee'),
    path('api/home_menu/employee', GetCurrentUserToManageForHomeMenu.as_view(), name='get_home_menu_employee'),
    # path('api/departments/<int:department_id>/', GetDepartmentById.as_view(), name='get_department_by_id'),
    # path('api/departments_chart/', DepartmentsChartView.as_view(), name='get_departments_chart'),
    # path('api/departments/', DepartmentsListView.as_view(), name='get_all_departments'),
    # path('api/add_department/', DepartmentCreateView.as_view(), name='create_department'),
    path('api/departments/', include('urls_dir.departments_urls')),
    path('api/employees/', include('urls_dir.employees_urls')),
    path('api/leave_types/', include('urls_dir.leave_types_urls')),

    path('api/leave_types/', LeaveTypeListView.as_view(), name='leave_types'),
    path('api/add_leave_type/', LeaveTypeCreateView.as_view(), name='create_leave_type'),
    path('api/leave_types/<int:pk>/delete/', LeaveTypeDeleteView.as_view(), name='delete_leave_type'),
    path('api/user-permissions/', PermissionsList.as_view(), name='permissions_list'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)