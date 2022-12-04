from rest_framework.serializers import ModelSerializer, ListSerializer

from restaurants.models import Restaurant, Review
from accounts.serializers import UserSerializer


class ReviewSerializer(ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Review
        fields = '__all__'


class RestaurantSerializer(ModelSerializer):
    reviews = ListSerializer(child=ReviewSerializer(), read_only=True)
    class Meta:
        model = Restaurant
        fields = (
            'id', 'name', 'description', 'rating', 'average_price', 'address_ko', 'address_en', 'longitude', 'latitude',
            'type', 'genre', 'reviews')
        read_only_fields = ('id',)
