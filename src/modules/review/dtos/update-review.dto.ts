import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class UpdateReviewDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  comment?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  rate?: number;
}
