import random

from rest_framework.decorators import action, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.generics import GenericAPIView
from rest_framework.viewsets import ModelViewSet

from app_accounts.models import User, Department
from app_accounts.serializers import UserSerializer, DepartmentSerializer


class UserCRUDView(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action in ['create','get_anonymous_name']:
            self.permission_classes = (AllowAny,)
        else:
            self.permission_classes = (IsAuthenticated,)
        return super().get_permissions()

    def create(self, request, *args, **kwargs):
        super(UserCRUDView, self).create(request, *args, **kwargs)
        return Response(status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response()

    @action(methods=['get'], detail=False, url_path='anonymous-name',
            permission_classes=(AllowAny,), url_name='anonymous-name')
    def get_anonymous_name(self, request):
        return Response(data=create_anonymous_name())


class DepartmentCRUDView(ModelViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer

    def create(self, request, *args, **kwargs):
        super(DepartmentCRUDView, self).create(request, *args, **kwargs)
        return Response(status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response()

def create_anonymous_name():
    rand_first = (
        '같잖은',
        '쓰디쓴',
        '똑똑한',
        '어수룩한',
        '코딩하는',
        '배고픈',
        '울부짖는',
        '잔머리굴리는',
        '공부하는',
        '빈둥대는',
        '헛걸음하는',
        '재빠른',
        '느긋한',
        '기침하는',
        '눈물나는',
        '슬픈',
        '웅장한',
        '무서운',
        '웃기는',
        '예리한',
        '똑부러지는',
        '힘찬',
        '힘없는',
        '허세가득한',
        '공포스러운',
        '하찮은',
        '귀여운',
        '아름다운',
        '찝찝한',
        '냄새나는',
        '향긋한',
        '축축한',
        '건조한',
        '물렁물렁한',
        '지각한',
        '전지전능한'
    )

    rand_second = (
        '고양이',
        '강아지',
        '코끼리',
        '사자',
        '호랑이',
        '토끼',
        '돼지',
        '양',
        '고래',
        '돌고래',
        '고릴라',
        '원숭이',
        '사슴',
        '코뿔소',
        '기린',
        '쿼카',
        '여우',
        '늑대',
        '뱀',
        '물개',
        '물고기',
        '개구리',
        '거북이',
        '말',
        '얼룩말',
        '말벌',
        '벌',
        '벌레',
        '개미',
        '너구리',
        '두더지',
        '거미',
        '거미줄',
        '서울쥐',
        '시골쥐',
        '드레곤',
        '투명드래곤',
        '땅콩',
        '콩',
        '콩나물',
        '미나리',
        '대파',
        '양파',
        '마늘',
        '토마토',
        '피망',
        '아욱',
        '감자',
        '고구마',
        '사과',
        '배',
        '바나나',
        '포도',
        '딸기',
        '수박',
        '참외',
        '오렌지',
        '레몬',
        '키위',
        '멜론',
        '토마토',
        '자몽',
        '파인애플',
        '두리안',
        '짜장면',
        '짬뽕',
        '탕수육',
        '볶음밥',
        '김치찌개',
        '된장찌개',
        '순두부찌개',
        '냉면',
        '비빔밥',
        '초밥',
        '우동',
        '라면',
        '김밥',
        '떡볶이',
        '튀김',
        '피자',
        '치킨',
        '햄버거',
        '초코파이',
        '케이크',
        '초콜릿',
        '아이스크림',
        '빵',
        '커피',
        '마카롱',
        '초밥',
        '규동',
        '백설기',
    )

    return f'{random.choice(rand_first)} {random.choice(rand_second)}'
