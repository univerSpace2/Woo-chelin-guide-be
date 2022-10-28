from django.contrib.auth import get_user_model
from rest_framework.viewsets import ModelViewSet

from accounts.serializers import UserSerializer

User = get_user_model()

class UserCRUD(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    