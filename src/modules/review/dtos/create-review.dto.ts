import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class CreateReviewDto {
  @IsString()
  @IsNotEmpty()
  comment: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  rate: number;

  @IsUUID()
  placeId: string;
}
