from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from ..serializers.records_serializer import RemoteWorkSerializer
from ..models_dir.records_models import HolidayRequest, RemoteWork, Type
from ..models_dir.employee_models import Employee
from mail_manager.mail_views.remote_emails import *
from ..permissions import HasRolePermissionWithRoles


class GetEmployeeRemoteRequests(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, employee_id):
        try:
            requests = RemoteWork.objects.filter(employee_id=employee_id)
            serializer = RemoteWorkSerializer(requests, many=True)
            return Response(serializer.data, status=200)
        except Employee.DoesNotExist:
            return Response({"error": "Employee not found"}, status=404)
        except RemoteWork.DoesNotExist:
            return Response({"error": "Remote requests not found"}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=500)
        

class GetRemotePendingRequests(APIView):
    permission_classes = [IsAuthenticated, HasRolePermissionWithRoles(['Owner', 'Manager'])]

    def get(self, request, approver_id):
        try:
            requests = RemoteWork.objects.filter(approver_id=approver_id, status=Type.PENDING.name)
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
        request_data = request.data

        try:
            employee_id = request_data.get('employee_id')
            approver_id = request_data.get('approver_id')

            employee = Employee.objects.get(employee_id=employee_id)
            approver = Employee.objects.get(employee_id=approver_id)

            remote_request = RemoteWork.objects.create(
                employee=employee,
                start_date=request_data.get('start_date'),
                end_date=request_data.get('end_date'),
                approver=approver,
                comment=request_data.get('comment', ""),
            )

            send_new_remote_email_to_manager(
                manager_email=remote_request.approver.user.email,
                employee_names=f"{remote_request.approver.first_name} {remote_request.approver.last_name}",
                request_id=remote_request.remote_id,
                start_date=remote_request.start_date,
                end_date=remote_request.end_date,
                request_description=remote_request.comment,
            )

            return Response({"message": "Remote request created successfully"}, status=201)
        except Employee.DoesNotExist:
            return Response({"error": "Employee not found"}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=500)


class EditRemoteRequest(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, request_id):
        request_data = request.data

        try:
            remote_request = RemoteWork.objects.get(remote_id=request_id)
            if remote_request.status == Type.REJECTED.name:
                return Response({"message": "Remote work request can not be edited because it was rejected"}, status=200)
            
            remote_request.start_date = request_data.get('start_date', remote_request.start_date)
            remote_request.end_date = request_data.get('end_date', remote_request.end_date)
            remote_request.comment = request_data.get('comment', remote_request.comment)

            if remote_request.status == Type.APPROVED.name or remote_request.status == Type.CANCELED.name:
                remote_request.status = Type.PENDING.name

            remote_request.save()
            serializer = RemoteWorkSerializer(remote_request)

            return Response(serializer.data, status=200)
        except RemoteWork.DoesNotExist:
            return Response({"error": "Remote work request not found"}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=500)

    
class CancelRemoteRequest(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, request_id):
        try:
            remote_request = RemoteWork.objects.get(remote_id=request_id)
            remote_request.status=Type.CANCELED.name
            remote_request.save()
            return Response({"message": "Remote request canceled successfully"}, status=200)
        except RemoteWork.DoesNotExist:
            return Response({"error": "Remote work request not found"}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=500)
        

class UpdateRemoteStatus(APIView):
    permission_classes = [IsAuthenticated, HasRolePermissionWithRoles(['Owner', 'Manager'])]

    def post(self, request):
        try:
            request_id = request.data.get('request_id')
            status = request.data.get('status')
            remote_request = RemoteWork.objects.get(remote_id=request_id)

            if status == "Approved":
                remote_request.status = Type.APPROVED.name
            elif status == "Rejected":
                remote_request.status = Type.REJECTED.name

            remote_request.save()

            send_remote_status_change_email(
                user_email=remote_request.employee.user.email,
                user_names=f"{remote_request.employee.first_name} {remote_request.employee.last_name}",
                request_id=remote_request.remote_id,
                new_status=remote_request.status,
                request_description=remote_request.comment
            )

            return Response({"message": "Holiday request status updated successfully"}, status=200)
        except HolidayRequest.DoesNotExist:
            return Response({"error": "Remote requests not found"}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=500)