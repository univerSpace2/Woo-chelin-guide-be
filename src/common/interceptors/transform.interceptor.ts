import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseFormat } from '../interfaces/response.interface';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ResponseFormat<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseFormat<T>> {
    return next.handle().pipe(
      map((data) => {
        // 이미 ResponseFormat 형태인 경우 그대로 반환
        if (
          data &&
          typeof data === 'object' &&
          'data' in data &&
          'msg' in data &&
          'meta' in data
        ) {
          return data;
        }

        // 응답 형식으로 변환
        return {
          data,
          msg: '성공적으로 처리되었습니다.',
          meta: {},
        };
      }),
    );
  }
}
