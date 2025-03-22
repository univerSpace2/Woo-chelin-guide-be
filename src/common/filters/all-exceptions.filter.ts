import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ResponseFormat } from '../interfaces/response.interface';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    // HttpAdapterHost를 사용하여 플랫폼에 독립적인 응답 처리
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();
    const request = ctx.getRequest();

    // HttpException인 경우 상태 코드와 응답을 가져옴
    // 그렇지 않은 경우 500 Internal Server Error로 처리
    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let errorMessage = '서버 오류가 발생했습니다.';
    let errorData = null;

    if (exception instanceof HttpException) {
      const errorResponse = exception.getResponse();

      if (typeof errorResponse === 'string') {
        errorMessage = errorResponse;
      } else if (typeof errorResponse === 'object') {
        errorMessage =
          errorResponse['message'] || exception.message || errorMessage;

        // message가 배열인 경우 (class-validator 오류)
        if (Array.isArray(errorResponse['message'])) {
          errorMessage = '입력값이 유효하지 않습니다.';
          errorData = errorResponse['message'];
        }
      } else {
        errorMessage = exception.message || errorMessage;
      }
    } else if (exception instanceof Error) {
      errorMessage = exception.message || errorMessage;
    }

    const responseBody: ResponseFormat<any> = {
      data: errorData,
      msg: errorMessage,
      meta: {
        statusCode: httpStatus,
        timestamp: new Date().toISOString(),
        path: request?.url || 'unknown',
        method: request?.method || 'unknown',
      },
    };

    // 오류 로깅
    this.logger.error(
      `${request?.method || 'unknown'} ${request?.url || 'unknown'} ${httpStatus}`,
      exception instanceof Error ? exception.stack : '',
    );

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
