from datetime import time, date, timedelta
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth.models import User
from api.models_dir.employee_models import Countries, Employee, Status

class CountriesTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="testpass")
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        self.country1 = Countries.objects.create(country_name="Testland")
        self.country2 = Countries.objects.create(country_name="Testland1")

        self.employee = Employee.objects.create(
            user=self.user,
            first_name="Test",
            middle_name="",
            last_name="User",
            age=30,
            email="testuser@example.com",
            phone_number="123456789",
            country=self.country1,
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


    def test_get_all_countries(self):
        url = reverse('get_all_countries')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)
        self.assertIn("country_name", response.data[0])


    def test_get_country_name(self):
        url = reverse('get_country_name', kwargs={'country_id': self.country1.country_id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["country_name"], "Testland")

        invalid_url = reverse('get_country_name', kwargs={'country_id': 7812308})
        response = self.client.get(invalid_url)
        self.assertEqual(response.status_code, 404)


    def test_create_country(self):
        url = reverse('add_country')
        data = {"country_name": "Newland"}
        response = self.client.post(url, data=data)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["data"]["country_name"], "Newland")

        self.employee.roles = []
        self.employee.save()
        response = self.client.post(url, data=data)
        self.assertEqual(response.status_code, 403) #?????
        self.employee.roles = [Employee.RoleChoices.HR]
        self.employee.save()


    def test_edit_country(self):
        url = reverse('edit_country', kwargs={'country_id': self.country1.country_id})
        data = {"country_name": "Updatedland"}
        response = self.client.put(url, data=data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["country_name"], "Updatedland")

        self.employee.roles = []
        self.employee.save()
        response = self.client.put(url, data=data)
        self.assertEqual(response.status_code, 403) #?????
        self.employee.roles = [Employee.RoleChoices.HR]
        self.employee.save()


    def test_delete_country(self):
        url = reverse('delete_country', kwargs={'country_id': self.country1.country_id})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 204)
        self.assertFalse(Countries.objects.filter(country_id=self.country1.country_id).exists())

        self.employee.roles=[]
        self.employee.save()
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 403) # ?????