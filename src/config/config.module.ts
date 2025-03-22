import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import configuration from './configuration';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        PORT: Joi.number().default(3000),
        DATABASE_HOST: Joi.string().default('localhost'),
        DATABASE_PORT: Joi.number().default(5432),
        DATABASE_USERNAME: Joi.string().default('postgres'),
        DATABASE_PASSWORD: Joi.string().default('postgres'),
        DATABASE_NAME: Joi.string().default('woochelin'),
        JWT_SECRET: Joi.string().default('secretKey'),
        JWT_EXPIRES_IN: Joi.string().default('1d'),
        CORS_ORIGIN: Joi.string().default('*'),
      }),
    }),
  ],
})
export class ConfigModule {}
