from rest_framework import serializers

from accounts.models import User, Profile, UserWorkStatus


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ('id', 'name', 'eng_name', 'phone')
        write_only_fields = ('user',)


class WorkStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserWorkStatus
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)
    # user_work_status = WorkStatusSerializer(read_only=True)

    class Meta:
        model = User
        fields = ('id', 'team_id','profile','is_active','is_admin')
        write_only_fields = ('password','email')
