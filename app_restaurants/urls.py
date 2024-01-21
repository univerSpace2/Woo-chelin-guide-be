from django.urls import include, path
from rest_framework.routers import DefaultRouter

from app_restaurants.views import RestaurantViewSet, ReviewViewSet

router = DefaultRouter()

router.register('restaurants', RestaurantViewSet)
router.register('reviews', ReviewViewSet)

urlpatterns = [
    path('', include(router.urls)),
]