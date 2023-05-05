from django.db import transaction
from ninja import Router

from config.commons import make_response
from .schemas import UserSchema, UserOutput, UserListOutput, ProfileSchema, UserInputSchema
from config.commons import BaseResponseSchema, create_anonymous_name
from .models import User, Profile

router_user = Router()


@router_user.get("/anonymous-name", response={200:BaseResponseSchema[str]})
def get_anonymous_name(request):
    return make_response(result=create_anonymous_name())


@transaction.atomic()
@router_user.post("/", response={201:UserOutput},)
def create_user(request, payload:UserInputSchema):
    user_input = payload.dict()
    profile_input = user_input.pop('profile')
    user = User.objects.create_user(**user_input)
    profile_input.update({"user_id":user.pk})
    profile = Profile.objects.create(**profile_input)
    profile.save()
    profile = ProfileSchema.from_orm(profile)
    user = UserSchema.from_orm(user)
    user.profile = profile

    return make_response("",user,201)


