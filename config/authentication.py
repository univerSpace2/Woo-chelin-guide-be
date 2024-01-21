from tokenize import TokenError

from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer, \
    TokenVerifySerializer
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView


class WooTokenObtainPairSerializer(TokenObtainPairSerializer):
    # response 커스텀
    default_error_messages = {
        'no_active_account': '아이디나 비밀번호가 일치하지 않습니다.',
    }

    # 유효성 검사
    def validate(self, attrs):
        data = super().validate(attrs)

        refresh = self.get_token(self.user)

        # response에 추가하고 싶은 key값들 추가
        data['email'] = self.user.email
        data['id'] = self.user.id
        data['refresh_token'] = str(refresh)
        data['access_token'] = str(refresh.access_token)
        data.pop('refresh')
        data.pop('access')
        return data


class WooTokenObtainPairView(TokenObtainPairView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = WooTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(e.args[0])
        except Exception as e:
            return Response(data=e.args[0],status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.validated_data, status=status.HTTP_200_OK)


class WooTokenRefreshSerializer(TokenRefreshSerializer):

    def validate(self, attrs):
        data = super().validate(attrs)
        access = data.pop('access')
        refresh = data.pop('refresh')
        data.update({'access_token': access, 'refresh_token': refresh})

        return data

class WooTokenRefreshView(TokenRefreshView):
    permission_classes = ()
    serializer_class = WooTokenRefreshSerializer

    def post(self, request, *args, **kwargs):
        # 커스텀 로직을 여기에 추가
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(e.args[0])
        return Response(serializer.validated_data, status=status.HTTP_200_OK)


class WooTokenVerifyView(TokenVerifyView):
    permission_classes = ()
    serializer_class = TokenVerifySerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(e.args[0])

        return Response(serializer.validated_data, status=status.HTTP_200_OK)