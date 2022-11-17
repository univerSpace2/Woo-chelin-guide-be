from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from accounts.models import User, Profile, UserWorkStatus


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ('id', 'name', 'eng_name', 'phone', 'user','anonymous_name')
        extra_kwargs = {
            'user': {'write_only': True}
        }
        # write_only_fields = ('user',)


class WorkStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserWorkStatus
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)
    # user_work_status = WorkStatusSerializer(read_only=True)


    class Meta:
        model = User
        fields = ('id', 'team_id','profile','is_active','is_admin', 'password','email')
        extra_kwargs = {'password': {'write_only': True}, 'email': {'write_only': True}}
        # write_only_fields = ('password','email')


class JWTLoginSerializer(serializers.ModelSerializer):
    email = serializers.CharField(
        required=True,
        write_only=True
    )
    password = serializers.CharField(
        required=True,
        write_only=True,
        style={'input_type': 'password'}
    )

    class Meta:
        model = User
        fields = ('email','password')

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')
        if User.objects.filter(email=email).exists():
            user = User.objects.get(email=email)
            if not user.check_password(password):
                raise serializers.ValidationError('비밀번호가 일치하지 않습니다.')
        else:
            raise serializers.ValidationError('존재하지 않는 이메일입니다.')

        token = RefreshToken.for_user(user)
        refresh = str(token)
        access = str(token.access_token)

        data = {
            'user': user,
            'refresh': refresh,
            'access': access
        }
        return data