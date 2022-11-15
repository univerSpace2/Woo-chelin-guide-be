from rest_framework import routers

from accounts.views import UserCRUD

router = routers.SimpleRouter()

router.register('users', UserCRUD)

urlpatterns = router.urls
