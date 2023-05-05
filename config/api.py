from typing import Dict, Any

from ninja import NinjaAPI

from accounts.schemas import get_user_schemas
from accounts.views import router_user
from restaurants.schemas import get_restaurant_schemas
from restaurants.views import router_restaurant

api = NinjaAPI(
    title="Woochellin Backend API",
    version="1.0",
)

api.add_router('restaurant', router=router_restaurant)
api.add_router("user", router=router_user)


