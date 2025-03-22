<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ bun install
```

## Running the app

```bash
# development
$ bun run start

# watch mode
$ bun run start:dev

# production mode
$ bun run start:prod
```

## Test

```bash
# unit tests
$ bun run test

# e2e tests
$ bun run test:e2e

# test coverage
$ bun run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).

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
