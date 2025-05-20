from datetime import date
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from ..serializers.records_serializer import HolidayRequestSerializer, HolidayPendingSerializer, RemoteWorkSerializer
from ..models_dir.records_models import HolidayRequest, RemoteWork, Type
from ..models_dir.employee_models import Employee, Status
from ..permissions import HasRolePermissionWithRoles


class GetEmployeePendingRequests(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, employee_id):
        try:
            holiday_requests = HolidayRequest.objects.filter(employee_id=employee_id, status=Type.PENDING.name)
            remote_requests = RemoteWork.objects.filter(employee_id=employee_id, status=Type.PENDING.name)

            holiday_requests_serialized = HolidayRequestSerializer(holiday_requests, many=True).data
            remote_requests_serialized = RemoteWorkSerializer(remote_requests, many=True).data

            return Response({
                "holiday_requests": holiday_requests_serialized,
                "remote_requests": remote_requests_serialized
            })
        except Employee.DoesNotExist:
            return Response({"error": "Employee not found"}, status=404)
        except HolidayRequest.DoesNotExist:
            return Response({"error": "Remote requests not found"}, status=404)
        except RemoteWork.DoesNotExist:
            return Response({"error": "Remote work request not found"}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=500)


class GetPendingApprovalRequests(APIView):
    permission_classes = [IsAuthenticated, HasRolePermissionWithRoles(['Owner', 'Manager'])]

    def get(self, request, approver_id):
        try:
            holiday_requests = HolidayRequest.objects.filter(approver_id=approver_id, status=Type.PENDING.name)
            remote_requests = RemoteWork.objects.filter(approver_id=approver_id, status=Type.PENDING.name)

            holiday_requests_serialized = HolidayPendingSerializer(holiday_requests, many=True).data
            remote_requests_serialized = RemoteWorkSerializer(remote_requests, many=True).data

            return Response({
                "holiday_requests": holiday_requests_serialized,
                "remote_requests": remote_requests_serialized
            }, status=200)
        except Employee.DoesNotExist:
            return Response({"error": "Employee not found"}, status=404)
        except HolidayRequest.DoesNotExist:
            return Response({"error": "Remote requests not found"}, status=404)
        except RemoteWork.DoesNotExist:
            return Response({"error": "Remote work request not found"}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=500)
        

class GetEventsForDepartment(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, department_id):
        try:
            employees = Employee.objects.filter(department_id=department_id, status=Status.ACTIVE.name)
            if not employees.exists():
                return Response({"message": "No employees for the current department"}, status=200)
            
            employee_data = employees.values("employee_id", "first_name", "middle_name", "last_name")
            employee_ids = employees.values_list("employee_id", flat=True)

            approved_holidays = HolidayRequest.objects.filter(
                employee_id__in=employee_ids, status=Type.APPROVED.name
            ).values("request_id", "employee_id", "start_date", "end_date", "comment")
            print(approved_holidays)

            approved_remote_requests = RemoteWork.objects.filter(
                employee_id__in=employee_ids, status=Type.APPROVED.name
            ).values("remote_id", "employee_id", "start_date", "end_date", "comment")
            print(approved_remote_requests)

            employees_with_names = [
                {"employee_id": emp["employee_id"], "first_name": emp["first_name"], "middle_name": emp["middle_name"],  "last_name": emp["last_name"]}
                for emp in employee_data
            ]

            return Response(
                {
                    "department_id": department_id,
                    "employees": employees_with_names,
                    "approved_holidays": list(approved_holidays),
                    "approved_remote_requests": list(approved_remote_requests),
                },
                status=200,
            )
        except Employee.DoesNotExist:
            return Response({"error": "Employee not found"}, status=404)
        except HolidayRequest.DoesNotExist:
            return Response({"error": "Remote requests not found"}, status=404)
        except RemoteWork.DoesNotExist:
            return Response({"error": "Remote work request not found"}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=500)
        

class GetUpcomingRequests(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, employee_id):
        try:
            upcoming_holidays = HolidayRequest.objects.filter(
                employee_id=employee_id,
                start_date__gt=date.today(),
                status=Type.APPROVED.name
            ).select_related("leave_type").values(
                "request_id", 
                "start_date", 
                "end_date", 
                "comment", 
                "leave_type__leave_name"
            )

            upcoming_remote_requests = RemoteWork.objects.filter(
                employee_id=employee_id,
                start_date__gt=date.today(),
                status=Type.APPROVED.name
            ).values("remote_id", "start_date", "end_date", "comment")

            return Response(
                {
                    "employee_id": employee_id,
                    "upcoming_holidays": list(upcoming_holidays),
                    "upcoming_remote_requests": list(upcoming_remote_requests),
                },
                status=200,
            )
        except Exception as e:
            return Response({"error": str(e)}, status=500)
        