from drf_yasg import openapi


def create_response_schema(result=None):
    """
        {"message": message,
        "result": result,
        "status": status,
        "status_code": status_code}

    """
    if result is None:
        result = openapi.Schema(type=openapi.TYPE_OBJECT)
    else:
        result = openapi.Schema()
    return openapi.Response(
        description='Success',
        schema=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'message': openapi.Schema(type=openapi.TYPE_STRING),
                'result': result,
                'status': openapi.Schema(type=openapi.TYPE_BOOLEAN),
                'status_code': openapi.Schema(type=openapi.TYPE_INTEGER),
            }
        ))
