from datetime import time, date, timedelta
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth.models import User
from api.models_dir.employee_models import Countries, Employee, Status
from api.models_dir.records_models import LeaveType

class LeaveTypeTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="testpass")
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        self.country = Countries.objects.create(country_name="Testland")

        self.leave_type1 = LeaveType.objects.create(leave_name="Sick Leave")
        self.leave_type2 = LeaveType.objects.create(leave_name="Vacation")

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
            position="HR Manager",
            hired_date=date.today() - timedelta(days=365),
            left_date=None,
            status=Status.ACTIVE.name,
            roles=[Employee.RoleChoices.HR]
        )
        

    def test_get_all_leave_types(self):
        url = reverse('leave_types')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)
        self.assertIn("leave_name", response.data[0])


    def test_create_leave_type(self):
        url = reverse('create_leave_type')
        data = {"leave_name": "Maternity Leave"}

        response = self.client.post(url, data=data, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["data"]["leave_name"], "Maternity Leave")

        self.employee.roles = []
        self.employee.save()
        response = self.client.post(url, data=data, format='json')
        self.assertEqual(response.status_code, 403)
        self.employee.roles = [Employee.RoleChoices.HR]
        self.employee.save()


    def test_edit_leave_type(self):
        url = reverse('edit_leave_type', kwargs={'leave_id': self.leave_type1.leave_id})
        data = {"leave_name": "Updated Sick Leave"}

        response = self.client.put(url, data=data, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["leave_name"], "Updated Sick Leave")

        self.employee.roles = []
        self.employee.save()
        response = self.client.put(url, data=data, format='json')
        self.assertEqual(response.status_code, 403)
        self.employee.roles = [Employee.RoleChoices.HR]
        self.employee.save()


    def test_delete_leave_type(self):
        url = reverse('delete_leave_type', kwargs={'leave_id': self.leave_type2.leave_id})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 204)
        self.assertFalse(LeaveType.objects.filter(leave_id=self.leave_type2.leave_id).exists())

        self.employee.roles = []
        self.employee.save()
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 403)