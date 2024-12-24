from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from ..models_dir.employee_models import NonWorkingDay, Countries
from ..serializers.records_serializer import NonWorkingDaySerializer
from django.contrib.auth.decorators import permission_required

class GetNonWorkingDaysByCountry(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, country_id):
        try:
            country = Countries.objects.get(country_id=country_id)
            non_working_days = NonWorkingDay.objects.filter(country=country)
            serializer = NonWorkingDaySerializer(non_working_days, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({"error": str(e)}, status=500)


# @permission_required(raise_exception=True)
class AddNonWorkingDay(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            country_id = request.data.get('country_id')
            date = request.data.get('date')
            description = request.data.get('description')
            country = Countries.objects.get(country_id=country_id)

            new_non_working_day = NonWorkingDay.objects.create(
                country=country,
                date=date,
                description=description
            )

            serializer = NonWorkingDaySerializer(new_non_working_day)
            return Response(serializer.data, status=201)
        except Countries.DoesNotExist:
            return Response({"error": "Country not found"}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=500)


# @permission_required(raise_exception=True)
class DeleteNonWorkingDay(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, country_id, nwd_id):
        try:
            country = Countries.objects.get(country_id=country_id)
            non_working_day = NonWorkingDay.objects.get(nwd_id=nwd_id, country=country)
            non_working_day.delete()
            return Response({"message": "Non-working day deleted successfully"}, status=204)
        except Countries.DoesNotExist:
            return Response({"error": "Country not found"}, status=404)
        
        except NonWorkingDay.DoesNotExist:
            return Response({"error": "Non-working day not found"}, status=404)
        
        except Exception as e:
            return Response({"error": str(e)}, status=500)