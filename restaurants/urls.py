from rest_framework.routers import DefaultRouter
from django.urls import path, include

from restaurants.views import RestaurantCRUD, ReviewCRUD

router = DefaultRouter()
router.register('', RestaurantCRUD)
router.register('reviews', ReviewCRUD)

urlpatterns = [
    path('', include(router.urls)),
]
