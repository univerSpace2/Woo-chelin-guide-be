import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { TagModule } from '../tag/tag.module';
import { PlaceTag } from './entities/place-tag.entity';
import { Place } from './entities/place.entity';
import { PlaceController } from './place.controller';
import { PlaceService } from './place.service';

@Module({
  imports: [MikroOrmModule.forFeature([Place, PlaceTag]), TagModule],
  controllers: [PlaceController],
  providers: [PlaceService],
  exports: [PlaceService],
})
export class PlaceModule {}
