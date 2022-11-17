from rest_framework.serializers import ModelSerializer

from restaurants.models import Restaurant, Review


class RestaurantSerializer(ModelSerializer):
    class Meta:
        model = Restaurant
        fields = '__all__'


class ReviewSerializer(ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'