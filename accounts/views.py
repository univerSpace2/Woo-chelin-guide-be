from django.contrib.auth import get_user_model, authenticate
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_tracking.mixins import LoggingMixin

from accounts.models import Profile
from accounts.serializers import UserSerializer, ProfileSerializer, JWTLoginSerializer
from accounts.utils import create_anonymous_name

User = get_user_model()


class UserCRUD(LoggingMixin, ModelViewSet,):
    queryset = User.objects.all()
    profile_queryset = Profile.objects.all()
    serializer_class = UserSerializer
    profile_serializer_class = ProfileSerializer

    def should_log(self, request, response):
        """Log only errors"""
        return response.status_code >= 400

    def get_permissions(self):
        if self.action in ['create']:
            self.permission_classes = [AllowAny]
        return super(self.__class__, self).get_permissions()

    def get_profile_serializer_class(self):
        """
        Return the class to use for the serializer.
        Defaults to using `self.serializer_class`.

        You may want to override this if you need to provide different
        serializations depending on the incoming request.

        (Eg. admins get full serialization, others get basic serialization)
        """
        assert self.profile_serializer_class is not None, (
                "'%s' should either include a `serializer_class` attribute, "
                "or override the `get_serializer_class()` method."
                % self.__class__.__name__
        )

        return self.profile_serializer_class

    def get_profile_serializer(self, *args, **kwargs):
        """
        Return the serializer instance that should be used for validating and
        deserializing input, and for serializing output.
        """
        serializer_class = self.get_profile_serializer_class()
        kwargs.setdefault('context', self.get_serializer_context())
        return serializer_class(*args, **kwargs)

    def get_profile_object(self, user):
        obj = self.profile_queryset.filter(user=user)
        if not obj:
            return None
        return obj.first()

    def create(self, request, *args, **kwargs):
        anonymous_name = create_anonymous_name()
        profile_data = request.data.pop('profile')
        if not profile_data:
            return Response({'profile': 'This field is required.'}, status=status.HTTP_400_BAD_REQUEST)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        profile_data['anonymous_name'] = anonymous_name
        profile_serializer = self.perform_create(serializer, profile_data)

        res_data = serializer.data
        res_data['profile'] = profile_serializer.data
        headers = self.get_success_headers(res_data)
        return Response(res_data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer, profile_data):
        serializer.save()
        instance = serializer.instance
        instance.set_password(instance.password)
        instance.save()
        if profile_data:
            profile_data['user'] = instance.id
            profile_serializer = self.get_profile_serializer(data=profile_data)
            profile_serializer.is_valid(raise_exception=True)
            profile_serializer.save()

        return profile_serializer

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', True)
        instance = self.get_object()
        profile = request.data.get('profile', {})
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        profile_serializer = self.perform_update(serializer, profile, partial)
        res_data = serializer.data
        res_data['profile'] = profile_serializer.data
        return Response(res_data, status=status.HTTP_200_OK)

    def perform_update(self, serializer, profile_data, partial):
        serializer.save()
        profile_instance = self.get_profile_object(serializer.instance)
        if profile_data:
            if profile_instance:
                profile_serializer = self.get_profile_serializer(profile_instance, data=profile_data, partial=partial)
                profile_serializer.is_valid(raise_exception=True)
                profile_serializer.save()
            else:
                profile_data['user'] = serializer.instance.id
                profile_serializer = self.get_profile_serializer(data=profile_data)
                profile_serializer.is_valid(raise_exception=True)
                profile_serializer.save()

        return profile_serializer

    @action(detail=True, methods=['get'], url_path='get-rand-name')
    def get_rand_name(self, request, pk=None):
        anonymous_name = create_anonymous_name()
        return Response({'anonymous_name': anonymous_name}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], url_path='change-password')
    def change_password(self, request, pk=None):
        input_data = request.data
        password_one = input_data.get('password_one')
        password_two = input_data.get('password_two')
        # using compare password function of django
        if not password_one or not password_two:
            return Response({'password': 'This field is required.'}, status=status.HTTP_400_BAD_REQUEST)
        if password_one != password_two:
            return Response({'password': 'Password does not match.'}, status=status.HTTP_400_BAD_REQUEST)

        instance = self.get_object()
        instance.set_password(password_one)
        instance.save()
        return Response({'msg': 'password changed successfully'}, status=status.HTTP_200_OK)

    # deprecated
    # @action(detail=False, methods=['get'], url_path='work_status')
    # def work_status(self, request, *args, **kwargs):
    #     return Response({'status': 'ok'})
    #
    # @action(detail=True, methods=['get'], url_path='work_status')
    # def work_status_list(self, request, *args, **kwargs):
    #     return Response(data={'status_list':[{'id': 1, 'name': 'test'}]}, status=status.HTTP_200_OK)
    #
    # @action(detail=True, methods=['post'], url_path='work_status')
    # def work_status_create(self, request, *args, **kwargs):


class AuthView(APIView, LoggingMixin):
    permission_classes = (AllowAny,)
    serializer_class = JWTLoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.validated_data['user']
            access_token = serializer.validated_data['access']
            refresh_token = serializer.validated_data['refresh']
            return Response({
                'access_token': access_token,
                'refresh_token': refresh_token,
                'user': UserSerializer(user).data}
                , status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
