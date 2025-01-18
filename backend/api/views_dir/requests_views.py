from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from ..serializers.records_serializer import HolidayRequestsSerializer, RemoteWorkSerializer
from ..models_dir.records_models import HolidayRequest, RemoteWork
from ..models_dir.employee_models import Employee

# Holiday request handling
class GetEmployeeHolidayRequests(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, employee_id):
        try:
            employee = Employee.objects.get(employee_id=employee_id)
            requests = HolidayRequest.objects.filter(employee=employee)
            serializer = HolidayRequestsSerializer(requests, many=True)
            return Response(serializer.data, status=200)
        except Employee.DoesNotExist:
            return Response({"error": "Employee not found"}, status=404)
        except HolidayRequest.DoesNotExist:
            return Response({"error": "Holiday requests not found"}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=500)
        

class GetHolidayPendingRequests(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, approver_id):
        try:
            approver = Employee.objects.get(employee_id=approver_id)
            requests = HolidayRequest.objects.filter(approver=approver)
            serializer = HolidayRequestsSerializer(requests, many=True)
            return Response(serializer.data, status=200)
        except Employee.DoesNotExist:
            return Response({"error": "Employee not found"}, status=404)
        except HolidayRequest.DoesNotExist:
            return Response({"error": "Remote requests not found"}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=500)


class AddHolidayRequest(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        pass


class EditHolidayRequest(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        pass


class DeleteHolidayRequest(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, employee_id):
        pass


class GetSubstitutes(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, reqeust):
        pass


# Remote request handling
class GetEmployeeRemoteRequests(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, employee_id):
        try:
            employee = Employee.objects.get(employee_id=employee_id)
            requests = RemoteWork.objects.filter(employee=employee)
            serializer = RemoteWorkSerializer(requests, many=True)
            return Response(serializer.data, status=200)
        except Employee.DoesNotExist:
            return Response({"error": "Employee not found"}, status=404)
        except RemoteWork.DoesNotExist:
            return Response({"error": "Remote requests not found"}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=500)
        

class GetRemotePendingRequests(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, approver_id):
        try:
            approver = Employee.objects.get(employee_id=approver_id)
            requests = RemoteWork.objects.filter(approver=approver)
            serializer = RemoteWorkSerializer(requests, many=True)
            return Response(serializer.data, status=200)
        except Employee.DoesNotExist:
            return Response({"error": "Employee not found"}, status=404)
        except RemoteWork.DoesNotExist:
            return Response({"error": "Remote requests not found"}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=500)


class AddRemoteRequest(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        pass


class EditRemoteRequest(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        pass

    
class DeleteRemoteRequest(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, employee_id):
        pass