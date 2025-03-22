import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { ConfigModule } from './config/config.module';
import { PlaceModule } from './modules/place/place.module';
import { ReviewModule } from './modules/review/review.module';
import { TagModule } from './modules/tag/tag.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule,
    MikroOrmModule.forRoot(),
    CommonModule,
    UserModule,
    PlaceModule,
    TagModule,
    ReviewModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
