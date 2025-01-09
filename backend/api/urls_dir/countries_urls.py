from django.urls import path
from ..views_dir.countries_views import *

urlpatterns = [
    path('', GetAllCountries.as_view(), name='get_all_countries'),
    path('<int:country_id>/by-country_id/', GetAllCountryName.as_view(), name='get_country_name'),
    path('add/', CreateCountry.as_view(), name='add_country'),
    path('<int:country_id>/delete/', DeleteCountry.as_view(), name='delete_country'),
    path('<int:country_id>/edit/', EditCountry.as_view(), name='edit_country'),
]