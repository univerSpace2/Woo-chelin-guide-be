import { EntityManager } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PlaceService } from '../place/place.service';
import { CreateReviewDto } from './dtos/create-review.dto';
import { UpdateReviewDto } from './dtos/update-review.dto';
import { Review } from './entities/review.entity';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: EntityRepository<Review>,
    private readonly em: EntityManager,
    private readonly placeService: PlaceService,
  ) {}

  async create(userId: string, createReviewDto: CreateReviewDto) {
    const { placeId, ...reviewData } = createReviewDto;
    const place = await this.placeService.findOne(placeId);

    const review = this.reviewRepository.create({
      ...reviewData,
      user: { userId },
      place,
    });

    await this.em.persistAndFlush(review);
    await this.placeService.updateAvgRate(placeId);

    return review;
  }

  async findAll(userId?: string, placeId?: string) {
    const where: any = {};

    if (userId) {
      where.user = { userId };
    }

    if (placeId) {
      where.place = { placeId };
    }

    return this.reviewRepository.find(where, {
      populate: ['user', 'place'],
    });
  }

  async findOne(reviewId: string) {
    const review = await this.reviewRepository.findOne(
      { reviewId },
      { populate: ['user', 'place'] },
    );

    if (!review) {
      throw new NotFoundException(`Review with ID ${reviewId} not found`);
    }

    return review;
  }

  async update(
    reviewId: string,
    userId: string,
    updateReviewDto: UpdateReviewDto,
  ) {
    const review = await this.findOne(reviewId);

    if (review.user.userId !== userId) {
      throw new BadRequestException('You can only update your own reviews');
    }

    this.em.assign(review, updateReviewDto);
    await this.em.flush();

    if (updateReviewDto.rate) {
      await this.placeService.updateAvgRate(review.place.placeId);
    }

    return review;
  }

  async remove(reviewId: string, userId: string) {
    const review = await this.findOne(reviewId);

    if (review.user.userId !== userId) {
      throw new BadRequestException('You can only delete your own reviews');
    }

    const placeId = review.place.placeId;

    await this.em.removeAndFlush(review);
    await this.placeService.updateAvgRate(placeId);

    return { success: true };
  }
}
