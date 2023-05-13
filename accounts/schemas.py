from typing import Optional, Dict, Any

from ninja import ModelSchema, Schema

from config.commons import BaseResponseSchema, BasePaginationSchema
from .models import User, Profile


# Profile
class ProfileSchema(ModelSchema):
    class Config:
        model = Profile
        model_fields = '__all__'
        orm_mode = True


class ProfileInputSchema(Schema):
    name: str
    eng_name: str
    phone: str
    anonymous_name: str


class ProfileOutput(BaseResponseSchema[ProfileSchema]):
    pass


class ProfilePagination(BasePaginationSchema[ProfileSchema]):
    pass


class ProfileListOutput(BaseResponseSchema[ProfilePagination]):
    pass


# User
class UserInputSchema(Schema):
    password: str
    email: str
    profile: ProfileInputSchema


class UserSchema(ModelSchema):
    profile: Optional[ProfileSchema]

    class Config:
        model = User
        model_fields = ["id", "password", "email"]
        orm_mode = True

class TokenSchema(Schema):
    access_token: str
    refresh_token:str

class UserTokenSchema(Schema):
    user: UserSchema
    token: TokenSchema

class LoginInput(Schema):
    email:str
    password:str

class UserOutput(BaseResponseSchema[UserSchema]):
    pass


class UserPagination(BasePaginationSchema[UserSchema]):
    pass


class UserListOutput(BaseResponseSchema[UserPagination]):
    pass


def get_user_schemas() -> Dict[str, Any]:
    return {
        'ProfileSchema':ProfileSchema.schema(),
        'ProfileInputSchema':ProfileInputSchema.schema(),
        'UserInputSchema':UserInputSchema.schema(),
        'UserSchema':UserSchema.schema(),
        'UserOutput':UserOutput.schema(),
        'UserListOutput':UserOutput.schema()
    }


class UserTokenOutput(BaseResponseSchema[UserTokenSchema]):
    pass

class TokenOutput(BaseResponseSchema[TokenSchema]):
    pass