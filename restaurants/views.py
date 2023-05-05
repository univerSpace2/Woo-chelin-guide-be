from django.db import transaction
from django.shortcuts import get_object_or_404
from ninja import Router
from .models import Restaurant, Review
from restaurants.schemas import RestaurantSchema, RestaurantOutput, RestaurantListOutput
from config.commons import make_response, get_paginate_res

router_restaurant = Router()


@transaction.atomic()
@router_restaurant.get('/', response=RestaurantListOutput)
def restaurant_list(request, page: int = 1, page_size: int = 10):
    all_objs = Restaurant.objects.all()
    all_objs = [RestaurantSchema.from_orm(qs) for qs in all_objs]
    res = get_paginate_res(all_objs, page, page_size)
    res = make_response("", res, 200)
    return res


@transaction.atomic()
@router_restaurant.get("/{restaurant_id}", response=RestaurantOutput, )
def restaurant_retrieve(request, restaurant_id: int):
    restaurant = get_object_or_404(Restaurant, id=restaurant_id)
    restaurant = RestaurantSchema.from_orm(restaurant)
    return make_response("", restaurant, 200)


@transaction.atomic()
@router_restaurant.post("/", response={201: RestaurantOutput})
def restaurant_create(request, payload: RestaurantSchema):
    restaurant = Restaurant.objects.create(**payload.dict())
    restaurant = RestaurantSchema.from_orm(restaurant)
    return make_response("", restaurant, status_code=201)


@transaction.atomic()
@router_restaurant.put("/{restaurant_id}", response=RestaurantOutput)
def restaurant_update(request, restaurant_id: int, payload: RestaurantSchema):
    restaurant = get_object_or_404(Restaurant, id=restaurant_id)
    for attr, value in payload.dict().items():
        setattr(restaurant, attr, value)
    restaurant.save()
    restaurant = RestaurantSchema.from_orm(restaurant)
    return make_response("success", restaurant, status_code=200)


@transaction.atomic()
@router_restaurant.delete("/{restaurant_id}")
def restaurant_destroy(request, restaurant_id: int):
    restaurant = get_object_or_404(Restaurant, id=restaurant_id)
    restaurant.delete()
    return make_response("", None, 204)
