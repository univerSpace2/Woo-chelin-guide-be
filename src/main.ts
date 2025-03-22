import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  AllExceptionsFilter,
  HttpExceptionFilter,
  TransformInterceptor,
} from './common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // CORS 설정
  app.enableCors({
    origin: configService.get<string>('cors.origin') || '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // 전역 파이프 설정 (유효성 검사)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 정의되지 않은 속성 제거
      forbidNonWhitelisted: true, // DTO에 정의되지 않은 속성이 있으면 요청 거부
      transform: true, // 요청 데이터를 DTO 클래스의 인스턴스로 변환
    }),
  );

  // 전역 인터셉터 설정 (응답 형식 변환)~
  app.useGlobalInterceptors(new TransformInterceptor());

  // 전역 예외 필터 설정
  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(
    new AllExceptionsFilter(httpAdapterHost),
    new HttpExceptionFilter(),
  );

  // 포트 설정
  const port = configService.get<number>('port') || 3000;
  await app.listen(port);
  console.log(`애플리케이션이 포트 ${port}에서 실행 중입니다.`);
}
bootstrap();
