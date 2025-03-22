import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { PlaceModule } from '../place/place.module';
import { Review } from './entities/review.entity';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';

@Module({
  imports: [MikroOrmModule.forFeature([Review]), PlaceModule],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}
