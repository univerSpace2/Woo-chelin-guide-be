from django.db import transaction
from rest_framework import serializers
from app_accounts.models import User, Profile, Department


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__'

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'

class ProfileCreateSerializer(serializers.Serializer):
    name = serializers.CharField(required=True)
    phone = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    anonymous_name=serializers.CharField(required=True)

class UserSerializer(serializers.ModelSerializer):
    profile = ProfileCreateSerializer()
    department_id = serializers.IntegerField(required=False, write_only=True)
    department = serializers.CharField(required=False, read_only=True)

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['department'] = instance.department.name if instance.department else None
        return representation

    def to_internal_value(self, data):
        internal_data = super().to_internal_value(data)
        internal_data['department'] = Department.objects.get(department_id=data.get('department_id'))
        return internal_data

    class Meta:
        model = User
        fields = '__all__'

    @transaction.atomic
    def create(self, validated_data):
        profile_data = validated_data.pop('profile')
        user = User.objects.create(**validated_data)
        profile_data['user'] = user.id
        profile_serializer = ProfileSerializer(data=profile_data)
        profile_serializer.is_valid(raise_exception=True)
        profile_serializer.save()
        return user

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile')
        instance = super().update(instance, validated_data)
        profile_serializer = ProfileSerializer(instance.profile, data=profile_data, partial=True)
        profile_serializer.is_valid(raise_exception=True)
        profile_serializer.save()
        return instance
