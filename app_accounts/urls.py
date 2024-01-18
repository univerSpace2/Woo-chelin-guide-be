from django.urls import path, include
from rest_framework.routers import DefaultRouter

from app_accounts.views import UserCRUDView, DepartmentCRUDView

router = DefaultRouter()
router.register('users', UserCRUDView)
router.register('departments', DepartmentCRUDView)


urlpatterns = [
    path('', include(router.urls)),
]