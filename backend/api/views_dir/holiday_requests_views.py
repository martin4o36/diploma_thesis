from datetime import datetime, timedelta
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db import transaction
from ..serializers.records_serializer import HolidayRequestSerializer, HolidayPendingSerializer
from ..models_dir.records_models import HolidayRequest, Substitute, LeaveType, Type, EmployeeLeaveBalance
from ..models_dir.employee_models import Employee, NonWorkingDay
from mail_manager.mail_views.holiday_emails import *
from ..permissions import HasRolePermissionWithRoles


class GetEmployeeHolidayRequests(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, employee_id):
        try:
            requests = HolidayRequest.objects.filter(employee_id=employee_id)
            serializer = HolidayRequestSerializer(requests, many=True)
            return Response(serializer.data, status=200)
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

    @transaction.atomic
    def post(self, request):
        request_data = request.data

        try:
            employee_id = request_data.get('employee_id')
            approver_id = request_data.get('approver_id')
            leave_type_id = request_data.get('leave_type_id')
            substitutes = request_data.get('substitutes')

            raw_start = request_data.get('start_date')
            raw_end = request_data.get('end_date')
            if not raw_start or not raw_end:
                return Response({"error": "Start date is required"}, status=400)
            
            start_date = datetime.strptime(raw_start, "%Y-%m-%d").date()
            end_date = datetime.strptime(raw_end, "%Y-%m-%d").date()

            if start_date > end_date:
                return Response({"error": "Start date cannot be after end date"}, status=400)

            employee = Employee.objects.get(employee_id=employee_id)
            approver = Employee.objects.get(employee_id=approver_id)
            leave_type = LeaveType.objects.get(leave_id=leave_type_id)

            days_to_use = calculate_days_used(start_date, end_date, employee.country)

            balances = EmployeeLeaveBalance.objects.filter(
                employee=employee,
                leave_type=leave_type,
                period_end_date__gte=start_date,
                period_start_date__lte=end_date
            ).order_by('period_start_date')

            total_available_days = sum(balance.days_left for balance in balances)
            
            if total_available_days < days_to_use:
                return Response({"error": "Insufficient leave balance across all periods."}, status=400)

            holiday_request = HolidayRequest.objects.create(
                employee=employee,
                leave_type=leave_type,
                start_date=request_data.get('start_date'),
                end_date=request_data.get('end_date'),
                approver=approver,
                comment=request_data.get('comment', ""),
            )

            if substitutes and isinstance(substitutes, list) and all(sub_id for sub_id in substitutes):
                sub_ids = set(int(sub_id) for sub_id in substitutes if int(sub_id) != employee_id)
                substitute_employees = Employee.objects.filter(employee_id__in=sub_ids)
                substitute_objects = [
                    Substitute(request=holiday_request, employee=sub)
                    for sub in substitute_employees
                ]
                Substitute.objects.bulk_create(substitute_objects)

            send_new_holiday_email_to_manager(
                manager_email=holiday_request.approver.user.email,
                employee_names=f"{holiday_request.approver.first_name} {holiday_request.approver.last_name}",
                request_id=holiday_request.request_id,
                start_date=holiday_request.start_date,
                end_date=holiday_request.end_date,
                request_description=holiday_request.comment,
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

    @transaction.atomic
    def put(self, request, request_id):
        request_data = request.data

        try:
            holiday_request = HolidayRequest.objects.get(request_id=request_id)
            if holiday_request.status == Type.REJECTED.name:
                return Response({"message": "Holiday request can not be edited because it was rejected"}, status=200)
            
            if holiday_request.status == Type.APPROVED.name:
                old_days_used = calculate_days_used(
                        holiday_request.start_date, 
                        holiday_request.end_date, 
                        country=holiday_request.employee.country
                    )
                
                old_balances = EmployeeLeaveBalance.objects.filter(
                    employee=holiday_request.employee,
                    leave_type=holiday_request.leave_type,
                    period_end_date__gte=holiday_request.start_date,
                    period_start_date__lte=holiday_request.end_date
                ).order_by('period_start_date')

                if not old_balances:
                    return Response({"error": "No leave balance found for the given period and leave type"}, status=404)

                for balance in old_balances:
                    if old_days_used <= 0:
                        break
                    balance_start = max(balance.period_start_date, holiday_request.start_date)
                    balance_end = min(balance.period_end_date, holiday_request.end_date)
                    overlap_days = calculate_days_used(balance_start, balance_end, holiday_request.employee.country)
                    days_to_remove = min(overlap_days, old_days_used)
                    balance.days_used -= days_to_remove
                    balance.save()
                    old_days_used -= days_to_remove

            new_leave_type_id = request_data.get('leave_type', holiday_request.leave_type.leave_id)
            if holiday_request.leave_type.leave_id != new_leave_type_id:
                try:
                    new_leave_type = LeaveType.objects.get(leave_id=new_leave_type_id)
                except LeaveType.DoesNotExist:
                    return Response({"error": "Leave type not found"}, status=404)
            else:
                new_leave_type = holiday_request.leave_type

            new_start_date = request_data.get('start_date', holiday_request.start_date)
            new_end_date = request_data.get('end_date', holiday_request.end_date)
            if isinstance(new_start_date, str):
                new_start_date = datetime.strptime(new_start_date, "%Y-%m-%d").date()
            if isinstance(new_end_date, str):
                new_end_date = datetime.strptime(new_end_date, "%Y-%m-%d").date()

            if new_start_date > new_end_date:
                return Response({"error": "Start date cannot be after end date"}, status=400)
            
            new_days_to_use = calculate_days_used(new_start_date, new_end_date, holiday_request.employee.country)
            new_balances = EmployeeLeaveBalance.objects.filter(
                employee=holiday_request.employee,
                leave_type=new_leave_type,
                period_end_date__gte=new_start_date,
                period_start_date__lte=new_end_date
            ).order_by('period_start_date')

            total_available_days = sum(balance.days_left for balance in new_balances)
            
            if total_available_days < new_days_to_use:
                return Response({"error": "Insufficient leave balance across all periods."}, status=400)
            
            holiday_request.leave_type = new_leave_type
            holiday_request.start_date = new_start_date
            holiday_request.end_date = new_end_date
            holiday_request.comment = request_data.get('comment', holiday_request.comment)
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
            serializer = HolidayRequestSerializer(holiday_request)
            return Response(serializer.data, status=200)
        except HolidayRequest.DoesNotExist:
            return Response({"error": "Holiday request not found"}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=500)


class CancelHolidayRequest(APIView):
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def put(self, request, request_id):
        try:
            holiday_request = HolidayRequest.objects.get(request_id=request_id)
            if holiday_request.status == Type.APPROVED.name:
                days_used = calculate_days_used(
                    holiday_request.start_date,
                    holiday_request.end_date,
                    holiday_request.employee.country,
                )

                balances = EmployeeLeaveBalance.objects.filter(
                    employee=holiday_request.employee,
                    leave_type=holiday_request.leave_type,
                    period_end_date__gte=holiday_request.start_date,
                    period_start_date__lte=holiday_request.end_date
                ).order_by('period_start_date')

                if not balances:
                    return Response({"error": "No leave balance found to add back days."}, status=404)
                
                remaining_days = days_used
                for balance in balances:
                    if remaining_days <= 0:
                        break
                    balance_start = max(balance.period_start_date, holiday_request.start_date)
                    balance_end = min(balance.period_end_date, holiday_request.end_date)
                    overlap_days = calculate_days_used(balance_start, balance_end, holiday_request.employee.country)
                    days_to_add = min(overlap_days, remaining_days)
                    
                    balance.days_used = max(balance.days_used - days_to_add, 0)
                    balance.save()

                    remaining_days -= days_to_add
            

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
                start_date = holiday_request.start_date
                end_date = holiday_request.end_date

                days_to_use = calculate_days_used(start_date, end_date, employee.country)

                balances = EmployeeLeaveBalance.objects.filter(
                    employee=employee,
                    leave_type=leave_type,
                    period_end_date__gte=start_date,
                    period_start_date__lte=end_date
                ).order_by('period_start_date')

                total_available_days = sum(balance.days_left for balance in balances)
                if total_available_days < days_to_use:
                    return Response({"error": "Insufficient leave balance to approve the request."}, status=400)
                
                days_to_use = calculate_days_used(start_date, end_date, employee.country)

                for balance in balances:
                    if days_to_use <= 0:
                        break
                    balance_start = max(balance.period_start_date, start_date)
                    balance_end = min(balance.period_end_date, end_date)
                    overlap_days = calculate_days_used(balance_start, balance_end, employee.country)
                    days_to_deduct = min(overlap_days, days_to_use, balance.days_left)

                    balance.days_used += days_to_deduct
                    balance.save()
                    days_to_use -= days_to_deduct

                holiday_request.status = Type.APPROVED.name
            elif status == "Rejected":
                holiday_request.status = Type.REJECTED.name

            holiday_request.save()

            send_holiday_status_change_email(
                user_email=holiday_request.employee.user.email,
                user_names=f"{holiday_request.employee.first_name} {holiday_request.employee.last_name}",
                request_id=holiday_request.request_id,
                new_status=holiday_request.status,
                request_description=holiday_request.comment
            )

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
    total_days = 0
    current_date = start_date

    while current_date <= end_date:
        if current_date.weekday() not in [5, 6] and current_date not in non_working_days:
            total_days += 1
        current_date += timedelta(days=1)

    return total_days


def deduct_days_across_balances(employee, leave_type, start_date, end_date):
    days_needed = calculate_days_used(start_date, end_date, employee.country)
    
    balances = EmployeeLeaveBalance.objects.filter(
        employee=employee,
        leave_type=leave_type,
        period_end_date__gte=start_date,
        period_start_date__lte=end_date
    ).order_by('period_start_date')

    for balance in balances:
        if days_needed <= 0:
            break

        period_start = max(balance.period_start_date, start_date)
        period_end = min(balance.period_end_date, end_date)

        overlap_days = calculate_days_used(period_start, period_end, employee.country)

        if overlap_days == 0:
            continue

        days_to_deduct = min(overlap_days, balance.days_left, days_needed)

        if days_to_deduct > 0:
            balance.days_used += days_to_deduct
            balance.save()
            days_needed -= days_to_deduct

    if days_needed > 0:
        raise ValueError("Insufficient leave balance across all periods.")