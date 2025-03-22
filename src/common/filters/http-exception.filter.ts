import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ResponseFormat } from '../interfaces/response.interface';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const errorResponse = exception.getResponse();

    let errorMessage: string;
    let errorData: any = null;

    if (typeof errorResponse === 'string') {
      errorMessage = errorResponse;
    } else if (typeof errorResponse === 'object') {
      errorMessage =
        errorResponse['message'] || exception.message || '오류가 발생했습니다.';

      // message가 배열인 경우 (class-validator 오류)
      if (Array.isArray(errorResponse['message'])) {
        errorMessage = '입력값이 유효하지 않습니다.';
        errorData = errorResponse['message'];
      }
    } else {
      errorMessage = exception.message || '오류가 발생했습니다.';
    }

    const responseBody: ResponseFormat<any> = {
      data: errorData,
      msg: errorMessage,
      meta: {
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method,
      },
    };

    this.logger.error(
      `${request.method} ${request.url} ${status}`,
      JSON.stringify(responseBody),
    );

    response.status(status).json(responseBody);
  }
}
