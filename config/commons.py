from typing import Any, List, Union

from django.core.paginator import Paginator
from django.db.models import QuerySet
from ninja import Schema

class BaseResponseSchema(Schema):
    message:str
    result:Any
    status_code:int

class BasePaginationSchema(Schema):
    total_count: int
    page: int
    page_size: int
    total_pages: int
    results: List[Any]

def make_response(message="",result={}, status_code=200):
    return {
        "message": message,
        "result": result,
        "status_code": status_code,
    }

def get_paginate_res(data:Union[QuerySet,List],page:int,page_size:int):
    paginator = Paginator(data, page_size)
    paginated_data = paginator.get_page(page)
    return {
        "total_count":paginator.count,
        "page":page,
        "page_size":page_size,
        "total_page":paginator.num_pages,
        "results":paginated_data
    }