from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from ..models_dir.employee_models import Countries
from ..serializers.emp_dep_serializer import CountrySerializer

class GetAllCountries(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            countries = Countries.objects.all()
            serializer = CountrySerializer(countries, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({"error": str(e)}, status=500)


class CreateCountry(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        pass

