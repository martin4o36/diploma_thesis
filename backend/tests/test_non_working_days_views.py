from datetime import time, date, timedelta, datetime
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth.models import User
from api.models_dir.employee_models import Countries, Employee, Status, NonWorkingDay

class CountriesTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="testpass")
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        self.country = Countries.objects.create(country_name="Testland")

        self.nwd1 = NonWorkingDay.objects.create(
            country=self.country,
            date=datetime.now() + timedelta(days=1),
            description="Test holiday 1"
        )
        self.nwd2 = NonWorkingDay.objects.create(
            country=self.country,
            date=datetime.now() + timedelta(days=2),
            description="Test holiday 2"
        )

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
            roles=[Employee.RoleChoices.HR]
        )


    def test_get_all_non_working_days(self):
        url = reverse('get_non_working_days', kwargs={'country_id': self.country.country_id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)
        self.assertIn("description", response.data[0])


    def test_create_non_working_day(self):
        url = reverse('add_non_working_day')
        data = {
            "country_id": self.country.country_id,
            "date": (datetime.now() + timedelta(days=3)).isoformat(),
            "description": "New public holiday"
        }
        response = self.client.post(url, data=data, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["description"], "New public holiday")

        self.employee.roles = []
        self.employee.save()
        response = self.client.post(url, data=data, format='json')
        self.assertEqual(response.status_code, 403) # ?????
        self.employee.roles = [Employee.RoleChoices.HR]
        self.employee.save()


    def test_edit_non_working_day(self):
        url = reverse('edit_non_working_day', kwargs={'nwd_id': self.nwd1.nwd_id})
        data = {"description": "Updated holiday name"}
        response = self.client.put(url, data=data, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["description"], "Updated holiday name")

        self.employee.roles = []
        self.employee.save()
        response = self.client.put(url, data=data, format='json')
        self.assertEqual(response.status_code, 403) # ?????
        self.employee.roles = [Employee.RoleChoices.HR]
        self.employee.save()


    def test_delete_non_working_day(self):
        url = reverse('delete_non_working_day', kwargs={
            'country_id': self.country.country_id,
            'nwd_id': self.nwd2.nwd_id
        })
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 204)
        self.assertFalse(NonWorkingDay.objects.filter(nwd_id=self.nwd2.nwd_id).exists())

        self.employee.roles = []
        self.employee.save()
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 403) # ?????