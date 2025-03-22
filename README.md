# Woochelin Guide Backend

## 소개

Woochelin Guide 백엔드 애플리케이션입니다. NestJS 프레임워크와 MikroORM을 사용하여 구현되었습니다.

## 설치

```bash
$ bun install
```

## 환경 변수 설정

`.env` 파일을 프로젝트 루트에 생성하고 다음과 같이 설정합니다:

```
# 서버 설정
PORT=3000
NODE_ENV=development

# 데이터베이스 설정
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=woochelin

# JWT 설정
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=1d

# CORS 설정
CORS_ORIGIN=*
```

## 데이터베이스 마이그레이션

### 데이터베이스 스키마 생성

```bash
$ bun run schema:create
```

### 마이그레이션 생성

```bash
$ bun run migration:create
```

### 마이그레이션 실행

```bash
$ bun run migration:up
```

### 마이그레이션 롤백

```bash
$ bun run migration:down
```

### 보류 중인 마이그레이션 확인

```bash
$ bun run migration:pending
```

## 시드 데이터

### 시드 파일 생성

```bash
$ bun run seed:create SeedName
```

### 시드 실행

```bash
$ bun run seed:run
```

## 애플리케이션 실행

```bash
# 개발 모드
$ bun run start:dev

# 프로덕션 모드
$ bun run start:prod
```

## 테스트

```bash
# 단위 테스트
$ bun run test

# e2e 테스트
$ bun run test:e2e

# 테스트 커버리지
$ bun run test:cov
```

## 프로젝트 구조

```
src/
├── common/           # 공통 모듈 (필터, 인터셉터, 유틸리티 등)
├── config/           # 환경 설정
├── migrations/       # 데이터베이스 마이그레이션
├── modules/          # 기능별 모듈
│   └── user/         # 사용자 모듈
│       ├── dtos/     # 데이터 전송 객체
│       ├── entities/ # 데이터베이스 엔티티
│       ├── user.controller.ts
│       ├── user.module.ts
│       └── user.service.ts
├── seeders/          # 데이터베이스 시드
├── app.module.ts     # 애플리케이션 루트 모듈
├── main.ts           # 애플리케이션 진입점
└── mikro-orm.config.ts # MikroORM 설정
```
