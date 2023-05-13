from django.contrib.auth import authenticate
from django.db import transaction
from django.shortcuts import get_object_or_404
from ninja import Router
from ninja.errors import HttpError

from config.commons import make_response, create_token, decode_token, TokenAuth, get_paginate_res
from .schemas import UserSchema, UserOutput, UserListOutput, ProfileSchema, UserInputSchema, UserTokenOutput, \
    TokenOutput, LoginInput
from config.commons import BaseResponseSchema, create_anonymous_name
from .models import User, Profile

router_user = Router()


@router_user.get("/anonymous-name", response={200: BaseResponseSchema[str]})
def get_anonymous_name(request):
    return make_response(result=create_anonymous_name())


@transaction.atomic()
@router_user.post("/register", response={201: UserTokenOutput}, )
def user_create(request, payload: UserInputSchema):
    user_input = payload.dict()
    profile_input = user_input.pop('profile')
    user = User.objects.create_user(**user_input)
    profile_input.update({"user_id": user.pk})
    profile = Profile.objects.create(**profile_input)
    profile.save()
    profile = ProfileSchema.from_orm(profile)
    user = UserSchema.from_orm(user)
    user.profile = profile
    token = create_token(user)

    return make_response("", {"user": user, "token": token}, 201)


@transaction.atomic()
@router_user.get("/", response=UserListOutput)
def user_list(request, page: int = 1, page_size: int = 10):
    all_objs = User.objects.select_related("profile").all()
    all_objs = [UserSchema.from_orm(qs) for qs in all_objs]
    res = get_paginate_res(all_objs, page, page_size)
    return make_response("", res, 200)


@transaction.atomic()
@router_user.get("/info", response=UserOutput, auth=TokenAuth())
def user_retrieve(request):
    try:
        user = User.objects.select_related("profile").get(id=request.auth.pk)
    except User.model.DoesNotExist:
        raise HttpError(404, "User does not exist")
    user = UserSchema.from_orm(user)
    return make_response("", user, 200)


@transaction.atomic()
@router_user.put("/{user_id}", response=UserOutput, auth=TokenAuth())
def user_update(request, user_id: int, payload: UserInputSchema):
    user_input = payload.dict()
    try:
        user = User.objects.select_related("profile").get(id=user_id)
    except User.model.DoesNotExist:
        raise HttpError(404, "User does not exist")
    for attr, value in user_input.items():
        setattr(user, attr, value)
    user.save()
    user = UserSchema.from_orm(user)
    return make_response("", user, 200)


@transaction.atomic()
@router_user.delete("/{user_id}")
def user_destroy(request, user_id: int):
    # 사용자는 삭제하지 않고 비활성화함.
    user = get_object_or_404(User, id=user_id)
    setattr(user, "is_active", False)
    return make_response("", None, 204)


@router_user.post("/login", response=TokenOutput)
def login(request, login_in: LoginInput):
    user = authenticate(username=login_in.username, password=login_in.password)
    if user is None:
        raise HttpError(400, "유효하지 않은 사용자입니다.")
    token = create_token(user)
    return make_response("", token)
