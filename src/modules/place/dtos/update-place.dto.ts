import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { PlaceCategory } from '../entities/place.entity';

export class UpdatePlaceDto {
  @IsOptional()
  @IsString()
  placeName?: string;

  @IsOptional()
  @IsEnum(PlaceCategory)
  category?: PlaceCategory;

  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude?: number;

  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude?: number;
}
