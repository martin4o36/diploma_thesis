from django.urls import path
from django.conf.urls.static import static
from django.conf import settings
from ..views_dir.employee_views import GetCurrentUserToManage, GetCurrentUserToManageForHomeMenu, CreateEmployee, GetEmployeesByDepartmentID

urlpatterns = [
    path('', GetCurrentUserToManage.as_view(), name='get_employee'),
    path('home/', GetCurrentUserToManageForHomeMenu.as_view(), name='get_home_menu_employee'),
    path('add/', CreateEmployee.as_view(), name='add_employee'),
    path('by-department/', GetEmployeesByDepartmentID.as_view(), name='get_employees_by_department')
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)