from typing import List, Dict, Any

from ninja import Schema, ModelSchema

from config.commons import BaseResponseSchema, BasePaginationSchema
from restaurants.models import Restaurant


class RestaurantSchema(ModelSchema):
    class Config:
        model = Restaurant
        model_fields = '__all__'
        orm_mode = True


class RestaurantOutput(BaseResponseSchema[RestaurantSchema]):
    pass


class RestaurantPagination(BasePaginationSchema[RestaurantSchema]):
    pass


class RestaurantListOutput(BaseResponseSchema[RestaurantPagination]):
    pass


def get_restaurant_schemas() -> Dict[str, Any]:
    return {
        'RestaurantSchema': RestaurantSchema.schema(),
        'RestaurantOutput': RestaurantOutput.schema(),
        'RestaurantListOutput': RestaurantListOutput.schema()
    }
