from django.urls import path
from ..views_dir.non_working_days_views import GetNonWorkingDaysByCountry, AddNonWorkingDay, DeleteNonWorkingDay

urlpatterns = [
    path('<int:country_id>/', GetNonWorkingDaysByCountry.as_view(), name='get_non_working_days'),
    path('add/', AddNonWorkingDay.as_view(), name='add_non_working_day'),
    path('<int:country_id>/<int:nwd_id>/delete/', DeleteNonWorkingDay.as_view(), name='delete_non_working_day'),
]