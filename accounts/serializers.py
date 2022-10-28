from rest_framework import serializers

from accounts.models import User, Profile, UserWorkStatus


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__'


class WorkStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserWorkStatus
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)
    user_work_status = WorkStatusSerializer(read_only=True)

    class Meta:
        model = User
        fields = '__all__'
