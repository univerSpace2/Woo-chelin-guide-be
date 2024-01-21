from rest_framework.test import APIClient, APITestCase
from rest_framework import status
from django.urls import reverse

from app_accounts.models import Department
from app_accounts.serializers import UserSerializer
from app_restaurants.models import Restaurant, Review
from app_restaurants.serializers import RestaurantSerializer, ReviewSerializer

class RestaurantViewSetTestCase(APITestCase):

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
            'profile': {
                'name': 'testUser',
                'phone': '010-1234-5678',
                'anonymous_name': '울부짖는 거미줄'
            }
        }
        serializer = UserSerializer(data=self.user_data)
        serializer.is_valid(raise_exception=True)
        self.user = serializer.save()

        self.restaurant_data = {
            'name':"푸드 카페",
            'description':'다양한 음식을 취급하는 종합 분식점',
            'average_price':7000,
            'address_ko':"서울시 강남구 여기로 120",
            'longitude': 127.034539,
            'latitude': 37.498287,
            'type':'점심',
            'genre':'분식',
        }
        self.client.force_authenticate(user=self.user)
        self.restaurant = None

    def create_restaurant(self):
        serializer = RestaurantSerializer(data=self.restaurant_data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        self.restaurant = serializer.instance

    def test_create_restaurant(self):
        # self.client.force_authenticate(user=self.user)
        response = self.client.post('/restaurants/restaurants/', self.restaurant_data, format='json')
        print(RestaurantSerializer(Restaurant.objects.first()).data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Restaurant.objects.count(), 1)

    def test_retrieve_restaurant(self):
        self.create_restaurant()
        self.assertIsInstance(self.restaurant,Restaurant)
        response = self.client.get(f'/restaurants/restaurants/{self.restaurant.id}/')
        print(response.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], self.restaurant.name)

    def test_list_restaurant(self):
        self.create_restaurant()
        self.assertIsInstance(self.restaurant,Restaurant)
        response = self.client.get(f'/restaurants/restaurants/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data),1)

    def test_update_restaurant(self):
        self.create_restaurant()
        self.assertIsInstance(self.restaurant, Restaurant)
        average_price = 8000
        response = self.client.put(f'/restaurants/restaurants/{self.restaurant.id}/',
                                   data={'average_price':average_price}, format='json')
        self.restaurant.refresh_from_db()
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        self.assertEqual(self.restaurant.average_price,average_price)


    def test_delete_restaurant(self):
        self.create_restaurant()
        self.assertIsInstance(self.restaurant, Restaurant)
        response = self.client.delete(f'/restaurants/restaurants/{self.restaurant.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Restaurant.objects.filter(id=self.restaurant.id).exists())

class ReviewViewSetTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user_data = {
            'email': 'test@example.com',
            'password': 'test1234',
            'profile': {
                'name': 'testUser',
                'phone': '010-1234-5678',
                'anonymous_name': '테스트유저'
            }
        }
        serializer = UserSerializer(data=self.user_data)
        serializer.is_valid(raise_exception=True)
        self.user = serializer.save()
        self.restaurant_data = {
            'name': "푸드 카페",
            'description': '다양한 음식을 취급하는 종합 분식점',
            'average_price': 7000,
            'address_ko': "서울시 강남구 여기로 120",
            'longitude': 127.034539,
            'latitude': 37.498287,
            'type': '점심',
            'genre': '분식',
        }
        self.client.force_authenticate(user=self.user)
        restaurant_serializer = RestaurantSerializer(data=self.restaurant_data)
        restaurant_serializer.is_valid(raise_exception=True)
        restaurant_serializer.save()
        self.restaurant = restaurant_serializer.instance

        self.review_data = {
            'restaurant_id':self.restaurant.id,
            'user_id':self.user.id,
            'content':"여기 진짜 맛있어요",
            'rating':4.8,
        }
        self.review = None


    def create_review(self):
        serializer = ReviewSerializer(data=self.review_data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        self.review = serializer.instance


    def test_create_review(self):
        response = self.client.post('/restaurants/reviews/', self.review_data, format='json')
        self.assertEqual(response.status_code,status.HTTP_201_CREATED)
        self.assertEqual(Review.objects.count(),1)

    def test_retrieve_review(self):
        self.create_review()
        self.assertIsInstance(self.review,Review)
        response = self.client.get(f'/restaurants/reviews/{self.review.id}/')
        print(response.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.restaurant.refresh_from_db()
        self.assertEqual(response.data['content'],self.review_data.get('content'))
        self.assertEqual(self.restaurant.rating, self.review_data.get('rating'))

    def test_list_review(self):
        self.create_review()
        self.assertIsInstance(self.review,Review)
        response = self.client.get(f'/restaurants/reviews/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data),1)

    def test_update_review(self):
        self.create_review()
        self.assertIsInstance(self.review,Review)
        response = self.client.put(f'/restaurants/reviews/{self.review.id}/', data={'good_cnt':1}, format='json')
        self.review.refresh_from_db()
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        self.assertEqual(self.review.good_cnt,1)

    def test_delete_review(self):
        self.create_review()
        self.assertIsInstance(self.review,Review)
        response = self.client.delete(f'/restaurants/restaurants/{self.review.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Review.objects.filter(id=self.review.id).exists())
