from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from ..models_dir.records_models import EmployeeLeaveBalance, LeaveType
from ..models_dir.employee_models import Employee
from ..serializers.records_serializer import EmployeeLeaveBalanceSerializer
from ..permissions import HasRolePermissionWithRoles
from datetime import date

class GetAllLeaveBalancesForEmployee(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, employee_id):
        try:
            employee = Employee.objects.get(employee_id=employee_id)
            leave_balances = EmployeeLeaveBalance.objects.filter(employee=employee)
            serializer = EmployeeLeaveBalanceSerializer(leave_balances, many=True)
            return Response(serializer.data, status=200)
        except Exception:
            return Response({"error": "Fetching allowances for employee failed"}, status=404)
        
class GetLeaveBalanceForEmployee(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, employee_id, leave_id):
        try:
            employee = Employee.objects.get(employee_id=employee_id)
            leave_type = LeaveType.objects.get(leave_id=leave_id)
            today = date.today()

            leave_balance = EmployeeLeaveBalance.objects.get(
                employee=employee,
                leave_type=leave_type,
                period_start_date__lte=today,
                period_end_date__gte=today
            )
            serializer = EmployeeLeaveBalanceSerializer(leave_balance)
            return Response(serializer.data, status=200)
        except Employee.DoesNotExist:
            return Response({"error": "Employee not found"}, status=404)
        except LeaveType.DoesNotExist:
            return Response({"error": "Leave Type not found"}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=500)

class CreateLeaveBalance(APIView):
    permission_classes = [IsAuthenticated, HasRolePermissionWithRoles(['Owner', 'HR'])]

    def post(self, request):
        employee_data = request.data
        employee_id = employee_data.get('employee_id')
        leave_type_id = employee_data.get('leave_type_id')
        
        try:
            employee = Employee.objects.get(employee_id=employee_id)
            leave_type = LeaveType.objects.get(leave_id=leave_type_id)

            leave_balance = EmployeeLeaveBalance.objects.create(
                employee = employee,
                leave_type = leave_type,
                period_start_date = employee_data.get('period_start_date'),
                period_end_date = employee_data.get('period_end_date'),
                days = employee_data.get('days'),
                bring_forward = employee_data.get('bring_forward'),
                days_used = employee_data.get('days_used'),
                comment = employee_data.get('comment', ""),
            )

            return Response({"message": "Leave Balance created successfully", "balance_id": leave_balance.balance_id}, status=201)
        except Employee.DoesNotExist:
            return Response({"error": "Employee not found"}, status=404)
        except LeaveType.DoesNotExist:
            return Response({"error": "Leave Type not found"}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=500)
        

class EditLeaveBalance(APIView):
    permission_classes = [IsAuthenticated, HasRolePermissionWithRoles(['Owner', 'HR'])]

    def put(self, request, leave_balance_id):
        try:
            balance_data = request.data
            leave_balance = EmployeeLeaveBalance.objects.get(balance_id=leave_balance_id)
            leave_type = LeaveType.objects.get(leave_id = balance_data.get('leave_type_id'))

            if leave_balance.leave_type != leave_type:
                leave_balance.leave_type = leave_type

            leave_balance.period_start_date = balance_data.get('period_start_date', leave_balance.period_start_date)
            leave_balance.period_end_date = balance_data.get('period_end_date', leave_balance.period_end_date)
            leave_balance.days = balance_data.get('days', leave_balance.days)
            leave_balance.bring_forward = balance_data.get('bring_forward', leave_balance.bring_forward)
            leave_balance.days_used = balance_data.get('days_used', leave_balance.days_used)
            leave_balance.comment = balance_data.get('comment', leave_balance.comment)

            leave_balance.save()
            return Response({"message": "Leave balance updated successfully"}, status=200)
        except EmployeeLeaveBalance.DoesNotExist:
            return Response({"error": "Leave Balance not found"}, status=404)
        except LeaveType.DoesNotExist:
            return Response({"error": "Leave Type not found"}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=500)


class DeleteLeaveBalances(APIView):
    permission_classes = [IsAuthenticated, HasRolePermissionWithRoles(['Owner', 'HR'])]

    def delete(self, request, leave_balance_id):
        try:
            leave_balance = EmployeeLeaveBalance.objects.get(balance_id = leave_balance_id)
            leave_balance.delete()
            return Response({"message": "Leave balance deleted successfully"}, status=204)
        except EmployeeLeaveBalance.DoesNotExist:
            return Response({"error": "Leave Balance not found"}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=500)