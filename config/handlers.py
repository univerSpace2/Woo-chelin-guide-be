from ninja.errors import HttpError


def custom_exception_handler(request, exc):
    if isinstance(exc, HttpError):
        return {
            "message": exc.detail,
            "status_code": exc.status_code,
            "data": None
        }
    else:
        # 기본 처리기를 사용하여 다른 예외를 처리하십시오.
        return None