from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from accounts.models import Profile
from accounts.serializers import UserSerializer, ProfileSerializer

User = get_user_model()


class UserCRUD(ModelViewSet):
    queryset = User.objects.all()
    profile_queryset = Profile.objects.all()
    serializer_class = UserSerializer
    profile_serializer_class = ProfileSerializer

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

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        profile_serializer = self.perform_create(serializer, request.data.get('profile', {}))
        res_data = serializer.data
        res_data['profile'] = profile_serializer.data
        headers = self.get_success_headers(res_data)
        return Response(res_data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer, profile_data):
        serializer.save()
        instance = serializer.instance
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

    def get_profile_object(self, user):
        obj = self.profile_queryset.filter(user=user)
        if not obj:
            return None
        return obj.first()

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

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        for user in queryset:
            profile = self.get_profile_object(user)
            user.profile = profile
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        profile_instance = self.get_profile_object(instance)
        profile_serializer = self.get_profile_serializer(profile_instance)
        res_data = serializer.data
        res_data['profile'] = profile_serializer.data
        res_data['profile'].pop('id')
        return Response(res_data)

    def destroy(self, request, *args, **kwargs):
        print(request.data)
        return super().destroy(request, *args, **kwargs)

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
