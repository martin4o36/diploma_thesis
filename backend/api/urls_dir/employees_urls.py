from django.urls import path
from ..views_dir.employee_views import GetCurrentUserToManage, GetCurrentUserToManageForHomeMenu

urlpatterns = [
    path('', GetCurrentUserToManage.as_view(), name='get_employee'),
    path('home', GetCurrentUserToManageForHomeMenu.as_view(), name='get_home_menu_employee'),
]