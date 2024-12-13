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
    path('api/user-permissions/', PermissionsList.as_view(), name='permissions_list'),

    path('api/employee/', include('api.urls_dir.employees_urls')),
    path('api/departments/', include('api.urls_dir.departments_urls')),
    path('api/leave-types/', include('api.urls_dir.leave_types_urls')),
    path('api/country/', include('api.urls_dir.countries_urls')),
    path('api/non-working-days/', include('api.urls_dir.non_working_days_urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)