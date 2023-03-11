from django.urls import path
from rest_framework import routers

from accounts.views import UserCRUD, AuthView

router = routers.DefaultRouter()

router.register('user', UserCRUD)

urlpatterns = router.urls

urlpatterns += [
    path('login/', AuthView.as_view()),
]