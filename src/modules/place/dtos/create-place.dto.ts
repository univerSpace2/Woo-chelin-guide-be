import { IsEnum, IsNumber, IsString, Max, Min } from 'class-validator';
import { PlaceCategory } from '../entities/place.entity';

export class CreatePlaceDto {
  @IsString()
  placeName: string;

  @IsEnum(PlaceCategory)
  category: PlaceCategory;

  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;
}
