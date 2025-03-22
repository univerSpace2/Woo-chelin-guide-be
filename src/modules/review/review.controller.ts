import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { CreateReviewDto } from './dtos/create-review.dto';
import { UpdateReviewDto } from './dtos/update-review.dto';
import { ReviewService } from './review.service';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  create(@Request() req, @Body() createReviewDto: CreateReviewDto) {
    return this.reviewService.create(req.user.userId, createReviewDto);
  }

  @Get()
  findAll(
    @Query('userId') userId?: string,
    @Query('placeId') placeId?: string,
  ) {
    return this.reviewService.findAll(userId, placeId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewService.findOne(id);
  }

  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return this.reviewService.update(id, req.user.userId, updateReviewDto);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.reviewService.remove(id, req.user.userId);
  }
}
