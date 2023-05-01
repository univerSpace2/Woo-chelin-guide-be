from typing import List

from ninja import Schema

from config.commons import BaseResponseSchema, BasePaginationSchema


class RestaurantInput(Schema):
    name: str
    description: str
    rating: float = 0.0
    average_price: int
    address_ko: str
    address_en: str
    longitude: float
    latitude: float
    type: str
    genre: str


class Restaurant(Schema):
    id: int
    name: str
    description: str
    rating: float = 0.0
    average_price: int
    address_ko: str
    address_en: str
    longitude: float
    latitude: float
    type: str
    genre: str


class RestaurantOutput(BaseResponseSchema):
    result: Restaurant


class RestaurantPagination(BasePaginationSchema):
    results = List[Restaurant]


class RestaurantListOutput(BaseResponseSchema):
    result = RestaurantPagination
