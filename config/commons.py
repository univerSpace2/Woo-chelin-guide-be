import random
from typing import Any, List, Union, TypeVar, Generic

from django.contrib.auth import get_user_model
from django.core.paginator import Paginator
from django.db.models import QuerySet
from ninja import Schema

import jwt
import datetime

from ninja.errors import HttpError
from ninja.security import HttpBearer

from config.settings import SECRET_KEY

T = TypeVar('T')


class BaseResponseSchema(Generic[T], Schema):
    message: str
    result: T
    status_code: int


class BasePaginationSchema(Generic[T], Schema):
    total_count: int
    page: int
    page_size: int
    total_pages: int
    results: List[T]


def make_response(message="", result={}, status_code=200):
    if status_code == 204:
        return status_code, None

    return status_code, {
        "message": message if message != "" else "success",
        "result": result,
        "status_code": status_code,
    }


def get_paginate_res(data: Union[QuerySet, List], page: int, page_size: int):
    paginator = Paginator(data, page_size)
    paginated_data = paginator.get_page(page)
    return {
        "total_count": paginator.count,
        "page": page,
        "page_size": page_size,
        "total_pages": paginator.num_pages,
        "results": paginated_data.object_list
    }


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

    return random.choice(rand_first) + ' ' + random.choice(rand_second)


def create_token(user):
    payload_access = {
        "user_id": user.id,  # Django 사용자 ID
        "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=30),  # 30분 후 만료
        "token_type": "access",  # 토큰 타입을 명시
    }
    payload_refresh = {
        "user_id": user.id,  # Django 사용자 ID
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7),  # 7일 후 만료
        "token_type": "refresh",  # 토큰 타입을 명시
    }

    access_token = jwt.encode(payload_access, SECRET_KEY, algorithm="HS256")
    refresh_token = jwt.encode(payload_refresh, SECRET_KEY, algorithm="HS256")

    return {"access_token":access_token,"refresh_token":refresh_token}



def decode_token(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms="HS256")
        return payload
    except jwt.ExpiredSignatureError:
        raise HttpError(401,"Signature expired. Please log in again.")
    except jwt.InvalidTokenError:
        raise HttpError(401, "Invalid token. Please log in again.")



class TokenAuth(HttpBearer):
    def authenticate(self, request, token):
        payload = decode_token(token)
        if isinstance(payload, str):  # 에러 메시지인 경우
            return None
        User = get_user_model()
        user = User.objects.filter(id=payload["user_id"]).first()
        return user