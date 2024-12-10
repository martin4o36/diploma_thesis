from django.urls import path
from ..views_dir.countries_views import GetAllCountries, CreateCountry

urlpatterns = [
    path('', GetAllCountries.as_view(), name='get_all_countries'),
    path('add/', CreateCountry.as_view(), name='add_country'),
]