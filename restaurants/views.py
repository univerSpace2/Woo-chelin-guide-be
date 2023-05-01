from django.shortcuts import get_object_or_404
from ninja import NinjaAPI

from models import Restaurant, Review
from restaurants.schemas import RestaurantInput, RestaurantOutput, RestaurantListOutput
from config.commons import make_response, get_paginate_res

api = NinjaAPI()


@api.get('/', response=RestaurantListOutput)
def restaurant_list(request, page: int = 1, page_size: int = 10):
    all_objs = Restaurant.objects.all()
    res = get_paginate_res(all_objs, page, page_size)
    return make_response("", res, 200)


@api.get("/{restaurant_id}", response=RestaurantOutput)
def restaurant_retrieve(request, restaurant_id: int):
    return make_response("", Restaurant.objects.get(id=restaurant_id), 200)


@api.post("/", response=RestaurantOutput)
def restaurant_create(request, payload: RestaurantInput):
    restaurant = Restaurant.objects.create(**payload)
    return make_response("", restaurant, status_code=201)


@api.put("/{restaurant_id}", response=RestaurantOutput)
def restaurant_update(request, restaurant_id: int, payload: RestaurantInput):
    restaurant = get_object_or_404(Restaurant, id=restaurant_id)
    for attr, value in payload.dict().items():
        setattr(restaurant, attr, value)
    restaurant.save()
    return make_response("success", restaurant, status_code=200)


@api.delete("/{restaurant_id}")
def restaurant_destroy(request, restaurant_id: int):
    restaurant = get_object_or_404(Restaurant, id=restaurant_id)
    restaurant.delete()
    return make_response("", None, 204)
