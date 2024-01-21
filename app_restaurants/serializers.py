from django.contrib.auth import get_user_model
from django.db import transaction
from rest_framework import serializers

from app_restaurants.models import Restaurant, Review

class ReviewSerializer(serializers.ModelSerializer):
    restaurant_id = serializers.IntegerField(required=False, write_only=True)
    user_id = serializers.IntegerField(required=False, write_only=True)

    def to_internal_value(self, data):
        if data.get('restaurant_id'):
            restaurant_id = data.pop('restaurant_id')
            data['restaurant'] = restaurant_id
        if data.get('user_id'):
            user_id = data.pop('user_id')
            data['user'] = user_id
        super().to_internal_value(data)
        return data

    def to_representation(self, instance:Review):
        ret = super().to_representation(instance)
        user_id = ret.pop('user')
        user = get_user_model().objects.get(id=user_id)
        ret['anonymous_name'] = user.profile.anonymous_name
        ret['restaurant_id'] = ret.pop('restaurant')
        return ret

    class Meta:
        model = Review
        fields = '__all__'

    @transaction.atomic
    def create(self, validated_data):
        rating = validated_data.get('rating',1.0)
        restaurant_id = validated_data['restaurant']
        user_id = validated_data['user']
        validated_data['restaurant'] = Restaurant.objects.get(id=restaurant_id)
        validated_data['user'] = get_user_model().objects.get(id=user_id)
        instance = super().create(validated_data)
        self.update_rating(instance.restaurant,rating)
        return instance

    @transaction.atomic
    def update(self, instance, validated_data):
        rating = validated_data.get('rating')
        instance = super().update(instance,validated_data)
        if rating:
            self.update_rating(instance.restaurant,rating)
        return instance

    @staticmethod
    def update_rating(restaurant, rating):
        review_count = restaurant.reviews.count()
        rating_sum = restaurant.rating*review_count + rating
        restaurant.rating = rating_sum/(review_count)
        restaurant.save()

class RestaurantSerializer(serializers.ModelSerializer):
    reviews = ReviewSerializer(many=True, read_only=True)

    class Meta:
        model = Restaurant
        fields = '__all__'

