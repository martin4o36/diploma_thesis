from datetime import time
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth.models import User
from datetime import date, timedelta
from api.models_dir.records_models import HolidayRequest, LeaveType, Type, EmployeeLeaveBalance
from api.models_dir.employee_models import Employee, Status, Countries

class HolidayRequestTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

        self.country = Countries.objects.create(country_name="Test Country")

        self.employee = Employee.objects.create(
            user=self.user,
            first_name="Test",
            middle_name="",
            last_name="User",
            age=30,
            email="testuser@example.com",
            phone_number="123456789",
            country=self.country,
            city="Test City",
            work_start=time(9, 0),
            work_end=time(17, 0),
            department_id=0,
            position="Developer",
            hired_date=date.today() - timedelta(days=365),
            left_date=None,
            status=Status.ACTIVE.name,
            roles=[Employee.RoleChoices.MANAGER]
        )

        self.leave_type = LeaveType.objects.create(leave_name='Vacation', leave_id=1, days=25)
        self.request = HolidayRequest.objects.create(
            employee=self.employee,
            leave_type=self.leave_type,
            start_date=date.today(),
            end_date=date.today() + timedelta(days=5),
            approver=self.employee,
            comment='test',
            status=Type.PENDING.name
        )

    def test_get_employee_holiday_requests(self):
        url = reverse('get_employee_holiday_requests', kwargs={'employee_id': self.employee.employee_id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)


    def test_get_pending_requests(self):
        url = reverse('get_pending_holiday_requests', kwargs={'approver_id': self.employee.employee_id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

    
    def test_add_holiday_request(self):
        data = {
            'employee_id': self.employee.employee_id,
            'approver_id': self.employee.employee_id,
            'leave_type_id': self.leave_type.leave_id,
            'start_date': str(date.today()),
            'end_date': str(date.today() + timedelta(days=2)),
            'substitutes': [],
            'comment': 'Need break'
        }

        EmployeeLeaveBalance.objects.create(
            employee=self.employee,
            leave_type=self.leave_type,
            days=20,
            period_start_date=date.today() - timedelta(days=100),
            period_end_date=date.today() + timedelta(days=100)
        )

        url = reverse('add_employee_holiday_request')
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 201)


    def test_edit_holiday_request(self):
        self.request.status = Type.APPROVED.name
        self.request.save()

        EmployeeLeaveBalance.objects.create(
            employee=self.employee,
            leave_type=self.leave_type,
            days=20,
            period_start_date=date.today(),
            period_end_date=date.today() + timedelta(days=100)
        )

        url = reverse('edit_employee_holiday_request', kwargs={'request_id': self.request.request_id})
        data = {
            'start_date': str(date.today() + timedelta(days=1)),
            'end_date': str(date.today() + timedelta(days=9)),
            'comment': 'Updated request',
            'leave_type': self.leave_type.leave_id,
            'substitutes': []
        }

        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, 200)


    def test_cancel_holiday_request(self):
        self.request.status = Type.APPROVED.name
        self.request.save()

        EmployeeLeaveBalance.objects.create(
            employee=self.employee,
            leave_type=self.leave_type,
            days=20,
            days_used=3,
            period_start_date=date.today(),
            period_end_date=date.today() + timedelta(days=10)
        )

        url = reverse('cancel_employee_holiday_request', kwargs={'request_id': self.request.request_id})
        response = self.client.put(url)
        self.assertEqual(response.status_code, 200)