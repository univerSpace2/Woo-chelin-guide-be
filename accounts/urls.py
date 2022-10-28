from rest_framework import routers

from accounts.views import UserCRUD

router = routers.DefaultRouter()

router.register('users', UserCRUD)

urlpatterns = router.urls
