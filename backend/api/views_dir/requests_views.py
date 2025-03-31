from datetime import date
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from ..serializers.records_serializer import HolidayRequestSerializer, HolidayPendingSerializer, RemoteWorkSerializer
from ..models_dir.records_models import HolidayRequest, RemoteWork, Substitute, LeaveType, Type, EmployeeLeaveBalance
from ..models_dir.employee_models import Employee, NonWorkingDay, Status
from datetime import datetime, timedelta
from mail_manager.mail_views.holiday_emails import send_holiday_status_change_email
from ..permissions import HasRolePermissionWithRoles

# Holiday request handling
class GetEmployeeHolidayRequests(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, employee_id):
        try:
            requests = HolidayRequest.objects.filter(employee_id=employee_id)
            serializer = HolidayRequestSerializer(requests, many=True)
            return Response(serializer.data, status=200)
        except Employee.DoesNotExist:
            return Response({"error": "Employee not found"}, status=404)
        except HolidayRequest.DoesNotExist:
            return Response({"error": "Holiday requests not found"}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=500)
        

class GetHolidayPendingRequests(APIView):
    permission_classes = [IsAuthenticated, HasRolePermissionWithRoles(['Owner', 'Manager'])]

    def get(self, request, approver_id):
        try:
            requests = HolidayRequest.objects.filter(approver_id=approver_id, status=Type.PENDING.name)
            serializer = HolidayPendingSerializer(requests, many=True)
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
        request_data = request.data

        try:
            employee_id = request_data.get('employee_id')
            approver_id = request_data.get('approver_id')
            leave_type_id = request_data.get('leave_type_id')
            substitutes = request_data.get('substitutes')
            start_date = request_data.get('start_date')
            end_date = request_data.get('end_date')

            employee = Employee.objects.get(employee_id=employee_id)
            approver = Employee.objects.get(employee_id=approver_id)
            leave_type = LeaveType.objects.get(leave_id=leave_type_id)

            if start_date > end_date:
                return Response({"error": "Start date cannot be after end date"}, status=400)
            
            employee_balance = EmployeeLeaveBalance.objects.filter(
                    employee=employee,
                    leave_type=leave_type,
                    period_start_date__lte=start_date,
                    period_end_date__gte=end_date,
                ).first()
            
            days_to_use = calculate_days_used(start_date, end_date, employee.country)
            if not employee_balance or employee_balance.days <= days_to_use:
                return Response({"error": "Insufficient leave balance."}, status=400)

            holiday_request = HolidayRequest.objects.create(
                employee=employee,
                leave_type=leave_type,
                start_date=request_data.get('start_date'),
                end_date=request_data.get('end_date'),
                approver=approver,
                comment=request_data.get('comment', ""),
            )

            if substitutes:
                for substitute_id in substitutes:
                    if employee_id != substitute_id:
                        substitute = Employee.objects.get(employee_id=substitute_id)
                        Substitute.objects.create(
                            request=holiday_request,
                            employee=substitute,
                        )

            send_holiday_status_change_email(
                employee.email, 
                employee.first_name + employee.last_name, 
                holiday_request.request_id, 
                new_status=holiday_request.status,
                request_description=holiday_request.comment
            )

            return Response({"message": "Holiday request created successfully"}, status=201)
        except Employee.DoesNotExist:
            return Response({"error": "Employee not found"}, status=404)
        except LeaveType.DoesNotExist:
            return Response({"error": "Leave type not found"}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=500)


class EditHolidayRequest(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, request_id):
        request_data = request.data

        try:
            holiday_request = HolidayRequest.objects.get(request_id=request_id)
            if holiday_request.status == Type.REJECTED.name:
                return Response({"message": "Holiday request can not be edited because it was rejected"}, status=200)
            
            old_employee_balance = None
            if holiday_request.status == Type.APPROVED.name:
                old_days_used = calculate_days_used(
                        holiday_request.start_date, 
                        holiday_request.end_date, 
                        country=holiday_request.employee.country
                    )
                
                old_employee_balance = EmployeeLeaveBalance.objects.filter(
                    employee=holiday_request.employee,
                    leave_type=holiday_request.leave_type,
                    period_start_date__lte=holiday_request.start_date,
                    period_end_date__gte=holiday_request.end_date,
                ).first()

                if not old_employee_balance:
                    return Response({"error": "No leave balance found for the given period and leave type"}, status=404)

                old_employee_balance.days += old_days_used

            new_leave_type_id = request_data.get('leave_type')
            if holiday_request.leave_type_id != new_leave_type_id:
                try:
                    new_leave_type = LeaveType.objects.get(leave_id=new_leave_type_id)
                    holiday_request.leave_type = new_leave_type
                except LeaveType.DoesNotExist:
                    return Response({"error": "Leave type not found"}, status=404)

            holiday_request.start_date = request_data.get('start_date', holiday_request.start_date)
            holiday_request.end_date = request_data.get('end_date', holiday_request.end_date)
            if holiday_request.start_date > holiday_request.end_date:
                return Response({"error": "Start date cannot be after end date"}, status=400)
            holiday_request.comment = request_data.get('comment', holiday_request.comment)

            if holiday_request.status == Type.APPROVED.name or holiday_request.status == Type.CANCELED.name:
                holiday_request.status = Type.PENDING.name

            new_substitutes = request_data.get('substitutes', [])
            existing_substitutes = set(Substitute.objects.filter(request=holiday_request).values_list('employee_id', flat=True))
            new_substitutes_set = set(map(int, new_substitutes))

            missing_substitutes = new_substitutes_set - existing_substitutes
            if missing_substitutes:
                try:
                    new_substitutes_objects = [
                        Substitute(request=holiday_request, employee=Employee.objects.get(employee_id=sub_id))
                        for sub_id in missing_substitutes if sub_id != holiday_request.employee_id
                    ]
                    Substitute.objects.bulk_create(new_substitutes_objects)
                except Employee.DoesNotExist:
                    return Response({"error": "One or more substitute employees do not exist"}, status=404)
                
            extra_substitutes = existing_substitutes - new_substitutes_set
            if extra_substitutes:
                Substitute.objects.filter(request=holiday_request, employee_id__in=extra_substitutes).delete()

            holiday_request.save()
            if old_employee_balance is not None:
                old_employee_balance.save()
            serializer = HolidayRequestSerializer(holiday_request)
            return Response(serializer.data, status=200)
        except HolidayRequest.DoesNotExist:
            return Response({"error": "Holiday request not found"}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=500)


class CancelHolidayRequest(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, request_id):
        try:
            holiday_request = HolidayRequest.objects.get(request_id=request_id)
            holiday_request.status=Type.CANCELED.name
            holiday_request.save()
            return Response({"message": "Holiday request canceled successfully"}, status=200)
        except HolidayRequest.DoesNotExist:
            return Response({"error": "Holiday request not found"}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=500)


class UpdateHolidayStatus(APIView):
    permission_classes = [IsAuthenticated, HasRolePermissionWithRoles(['Owner', 'Manager'])]

    def post(self, request):
        try:
            request_id = request.data.get('request_id')
            status = request.data.get('status')
            holiday_request = HolidayRequest.objects.get(request_id=request_id)

            if status == "Approved":
                holiday_request.status = Type.APPROVED.name
                employee = holiday_request.employee
                leave_type = holiday_request.leave_type

                employee_balance = EmployeeLeaveBalance.objects.filter(
                    employee=employee,
                    leave_type=leave_type,
                    period_start_date__lte=holiday_request.start_date,
                    period_end_date__gte=holiday_request.end_date,
                ).first()

                if not employee_balance:
                    return Response({"error": "No leave balance found for the given period and leave type"}, status=404)
                
                print("BEFORE DAYS USED")
                days_used = calculate_days_used(
                    holiday_request.start_date,
                    holiday_request.end_date,
                    holiday_request.employee.country,
                )
                print("DAYS USED: " + str(days_used))

                if employee_balance.days_left >= days_used:
                    employee_balance.use_days(days_used)
                else:
                    return Response({"error": "Not enough leave balance"}, status=400)
            elif status == "Rejected":
                holiday_request.status = Type.REJECTED.name

            holiday_request.save()
            return Response({"message": "Holiday request status updated successfully"}, status=200)
        except HolidayRequest.DoesNotExist:
            return Response({"error": "Remote requests not found"}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=500)
        

def calculate_days_used(start_date, end_date, country):
    if isinstance(start_date, str):
        start_date = datetime.strptime(start_date, "%Y-%m-%d").date()
    if isinstance(end_date, str):
        end_date = datetime.strptime(end_date, "%Y-%m-%d").date()

    non_working_days = NonWorkingDay.objects.filter(
        country=country,
        date__date__range=[start_date, end_date]
    ).values_list("date", flat=True)

    non_working_days = {nwd.date() for nwd in non_working_days}
    print("NON WORKING DAYS" + str(non_working_days))
    total_days = 0
    current_date = start_date

    while current_date <= end_date:
        if current_date.weekday() not in [5, 6] and current_date not in non_working_days:
            total_days += 1
        current_date += timedelta(days=1)

    return total_days


# Remote request handling
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
            return Response({"message": "Holiday request status updated successfully"}, status=200)
        except HolidayRequest.DoesNotExist:
            return Response({"error": "Remote requests not found"}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=500)
        

# Other views
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
        

class GetRequestsHistory(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, employee_id):
        try:
            holiday_requests = HolidayRequest.objects.filter(employee_id=employee_id)
            remote_requests = RemoteWork.objects.filter(employee_id=employee_id)

            holiday_requests_serialized = HolidayRequestSerializer(holiday_requests, many=True)
            remote_requests_serialized = RemoteWorkSerializer(remote_requests, many=True)

            data = {
                'holiday_requests': holiday_requests_serialized.data,
                'remote_requests': remote_requests_serialized.data
            }

            return Response(data, status=200)
        except Exception as e:
            return Response({"error": str(e)}, status=500)