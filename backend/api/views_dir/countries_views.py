from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from ..models_dir.employee_models import Countries
from ..serializers.emp_dep_serializer import CountrySerializer
from ..permissions import HasRolePermissionWithRoles

class GetAllCountries(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            countries = Countries.objects.all()
            serializer = CountrySerializer(countries, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({"error": str(e)}, status=500)
        

class GetCountryName(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, country_id):
        try:
            country = Countries.objects.get(country_id=country_id)
            return Response({"country_name": country.country_name})
        except Countries.DoesNotExist:
            return Response({"error": "Country not found"}, status=404)


class CreateCountry(APIView):
    permission_classes = [IsAuthenticated, HasRolePermissionWithRoles(['Owner', 'HR'])]

    def post(self, request):
        serializer = CountrySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Country created successfully", "data": serializer.data}, status=201)
        return Response({"message": "Failed to create country", "errors": serializer.errors}, status=400)
    

class DeleteCountry(APIView):
    permission_classes = [IsAuthenticated, HasRolePermissionWithRoles(['Owner', 'HR'])]

    def delete(self, request, country_id):
        try:
            country = Countries.objects.get(country_id=country_id)
            print(country)
            country.delete()
            return Response({"message": "Country deleted successfully"}, status=204)
        except Countries.DoesNotExist:
            return Response({"error": "Country not found"}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=500)
        

class EditCountry(APIView):
    permission_classes = [IsAuthenticated, HasRolePermissionWithRoles(['Owner', 'HR'])]

    def put(self, request, country_id):
        try:
            country = Countries.objects.get(country_id=country_id)
        except Countries.DoesNotExist:
            return Response({"error": "Country not found"}, status=404)
        
        serializer = CountrySerializer(country, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=400)