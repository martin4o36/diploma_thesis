from datetime import time, date, timedelta
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth.models import User
from api.models_dir.records_models import RemoteWork, Type
from api.models_dir.employee_models import Employee, Status, Countries

class RemoteRequestTests(APITestCase):
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

        self.request = RemoteWork.objects.create(
            employee=self.employee,
            start_date=date.today(),
            end_date=date.today() + timedelta(days=5),
            approver=self.employee,
            comment='test',
            status=Type.PENDING.name
        )


    def test_get_employee_remote_requests(self):
        url = reverse('get_employee_remote_requests', kwargs={'employee_id': self.employee.employee_id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)


    def test_get_remote_pending_requests(self):
        url = reverse('get_pending_remote_requests', kwargs={'approver_id': self.employee.employee_id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

        self.employee.roles=[]
        self.employee.save()
        response = self.client.get(url)
        self.assertEqual(response.status_code, 403) # ?????
        self.employee.roles=[Employee.RoleChoices.MANAGER]
        self.employee.save()


    def test_add_remote_request(self):
        data = {
            'employee_id': self.employee.employee_id,
            'approver_id': self.employee.employee_id,
            'start_date': str(date.today()),
            'end_date': str(date.today() + timedelta(days=2)),
            'comment': 'Need break'
        }

        url = reverse('add_employee_remote_request')
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 201)


    def test_edit_remote_request(self):
        self.request.status = Type.APPROVED.name
        self.request.save()

        url = reverse('edit_employee_remote_request', kwargs={'request_id': self.request.request_id})
        data = {
            'start_date': str(date.today() + timedelta(days=1)),
            'end_date': str(date.today() + timedelta(days=9)),
            'comment': 'Updated request',
        }

        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, 200)


    def test_cancel_remote_request(self):
        self.request.status = Type.APPROVED.name
        self.request.save()

        url = reverse('cancel_employee_remote_request', kwargs={'request_id': self.request.request_id})
        response = self.client.put(url)
        self.assertEqual(response.status_code, 200)


    def test_approve_remote_request(self):
        url = reverse('update_remote_request_status')
        data = {
            'request_id': self.request.request_id,
            'status': 'Approved'
        }

        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 200)

        self.request.refresh_from_db()
        self.assertEqual(self.request.status, Type.APPROVED.name)

        self.employee.roles = []
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 403) # ?????
        self.employee.roles=[Employee.RoleChoices.MANAGER]
        self.employee.save()


    def test_decline_remote_request(self):
        url = reverse('update_remote_request_status')
        data = {
            'request_id': self.request.request_id,
            'status': 'Rejected'
        }

        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 200)

        self.request.refresh_from_db()
        self.assertEqual(self.request.status, Type.REJECTED.name)

        self.employee.roles = []
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 403) # ?????