from rest_framework.test import APIClient, APITestCase
from rest_framework import status
from django.urls import reverse
from app_accounts.models import User,Profile,Department
from app_accounts.serializers import UserSerializer


class UserViewSetTestCase(APITestCase):

    def setUp(self):
        self.client = APIClient()
        self.department_data = {
            'name': '테스트부서'
        }
        self.department = Department.objects.create(**self.department_data)
        self.user_data = {
            'email': 'test@example.com',
            'password': 'test1234',
            'department_id': self.department.department_id,
            'profile':{
                'name': 'testUser',
                'phone': '010-1234-5678',
                'anonymous_name': '테스트유저'
            }
        }
        self.another_user_data = {
            'email': 'test2@example.com',
            'password': 'test1234',
            'department_id': self.department.department_id,
            'profile': {
                'name': 'testUser2',
                'phone': '010-5678-5678',
                'anonymous_name': '테스트유저2'
            }
        }
        serializer = UserSerializer(data=self.user_data)
        serializer.is_valid(raise_exception=True)
        self.user = serializer.save()

    def test_create_user(self):
        response = self.client.post(reverse('user-list'), self.another_user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 2)  # Assuming one user already created in setUp

    def test_retrieve_user(self):
        # fake auth
        self.client.force_authenticate(user=self.user)
        response = self.client.get(reverse('user-detail', args=[self.user.id]))
        print(response.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], self.user.email)

    def test_update_user(self):
        self.client.force_authenticate(user=self.user)
        new_phone_number = '010-4444-5555'
        response = self.client.patch(reverse('user-detail', args=[self.user.id]), {'profile': {"phone": new_phone_number}}, format='json')
        self.user.refresh_from_db()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(self.user.profile.phone, new_phone_number)

    def test_delete_user(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(reverse('user-detail', args=[self.user.id]))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(User.objects.filter(id=self.user.id).exists())

    def test_anonymous_name(self):
        response = self.client.get(reverse('user-anonymous-name'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(type(response.data),str)