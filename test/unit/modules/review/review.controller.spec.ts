import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateReviewDto } from '../../../../src/modules/review/dtos/create-review.dto';
import { UpdateReviewDto } from '../../../../src/modules/review/dtos/update-review.dto';
import { ReviewController } from '../../../../src/modules/review/review.controller';
import { ReviewService } from '../../../../src/modules/review/review.service';

describe('ReviewController', () => {
  let controller: ReviewController;

  const mockReviewService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReviewController],
      providers: [
        {
          provide: ReviewService,
          useValue: mockReviewService,
        },
      ],
    }).compile();

    controller = module.get<ReviewController>(ReviewController);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new review', async () => {
      const userId = 'user-id';
      const createReviewDto: CreateReviewDto = {
        placeId: 'place-id',
        comment: '맛있었어요!',
        rate: 5,
      };

      const mockReview = {
        reviewId: 'review-id',
        comment: createReviewDto.comment,
        rate: createReviewDto.rate,
        user: { userId },
        place: { placeId: createReviewDto.placeId },
      };

      mockReviewService.create.mockResolvedValue(mockReview);

      const req = { user: { userId } };
      const result = await controller.create(req, createReviewDto);

      expect(mockReviewService.create).toHaveBeenCalledWith(
        userId,
        createReviewDto,
      );
      expect(result).toEqual(mockReview);
    });
  });

  describe('findAll', () => {
    it('should return all reviews', async () => {
      const mockReviews = [
        { reviewId: 'review-1', comment: '맛있었어요!', rate: 5 },
        { reviewId: 'review-2', comment: '서비스가 좋아요', rate: 4 },
      ];

      mockReviewService.findAll.mockResolvedValue(mockReviews);

      const result = await controller.findAll();

      expect(mockReviewService.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockReviews);
    });

    it('should return reviews filtered by userId', async () => {
      const userId = 'user-id';
      const mockReviews = [
        {
          reviewId: 'review-1',
          comment: '맛있었어요!',
          rate: 5,
          user: { userId },
        },
      ];

      mockReviewService.findAll.mockResolvedValue(mockReviews);

      const result = await controller.findAll(userId);

      expect(mockReviewService.findAll).toHaveBeenCalledWith(userId, undefined);
      expect(result).toEqual(mockReviews);
    });

    it('should return reviews filtered by placeId', async () => {
      const placeId = 'place-id';
      const mockReviews = [
        {
          reviewId: 'review-1',
          comment: '맛있었어요!',
          rate: 5,
          place: { placeId },
        },
      ];

      mockReviewService.findAll.mockResolvedValue(mockReviews);

      const result = await controller.findAll(undefined, placeId);

      expect(mockReviewService.findAll).toHaveBeenCalledWith(
        undefined,
        placeId,
      );
      expect(result).toEqual(mockReviews);
    });
  });

  describe('findOne', () => {
    it('should return a review by id', async () => {
      const reviewId = 'review-id';
      const mockReview = { reviewId, comment: '맛있었어요!', rate: 5 };

      mockReviewService.findOne.mockResolvedValue(mockReview);

      const result = await controller.findOne(reviewId);

      expect(mockReviewService.findOne).toHaveBeenCalledWith(reviewId);
      expect(result).toEqual(mockReview);
    });

    it('should throw NotFoundException if review not found', async () => {
      const reviewId = 'non-existent';

      mockReviewService.findOne.mockRejectedValue(new NotFoundException());

      await expect(controller.findOne(reviewId)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockReviewService.findOne).toHaveBeenCalledWith(reviewId);
    });
  });

  describe('update', () => {
    it('should update a review', async () => {
      const reviewId = 'review-id';
      const userId = 'user-id';
      const updateReviewDto: UpdateReviewDto = {
        comment: '업데이트된 리뷰',
        rate: 4,
      };

      const mockReview = {
        reviewId,
        comment: updateReviewDto.comment,
        rate: updateReviewDto.rate,
        user: { userId },
      };

      mockReviewService.update.mockResolvedValue(mockReview);

      const req = { user: { userId } };
      const result = await controller.update(req, reviewId, updateReviewDto);

      expect(mockReviewService.update).toHaveBeenCalledWith(
        reviewId,
        userId,
        updateReviewDto,
      );
      expect(result).toEqual(mockReview);
    });

    it("should throw BadRequestException if user tries to update someone else's review", async () => {
      const reviewId = 'review-id';
      const userId = 'user-id';
      const updateReviewDto: UpdateReviewDto = {
        comment: '업데이트된 리뷰',
      };

      mockReviewService.update.mockRejectedValue(new BadRequestException());

      const req = { user: { userId } };

      await expect(
        controller.update(req, reviewId, updateReviewDto),
      ).rejects.toThrow(BadRequestException);
      expect(mockReviewService.update).toHaveBeenCalledWith(
        reviewId,
        userId,
        updateReviewDto,
      );
    });
  });

  describe('remove', () => {
    it('should remove a review', async () => {
      const reviewId = 'review-id';
      const userId = 'user-id';
      const mockResult = { success: true };

      mockReviewService.remove.mockResolvedValue(mockResult);

      const req = { user: { userId } };
      const result = await controller.remove(req, reviewId);

      expect(mockReviewService.remove).toHaveBeenCalledWith(reviewId, userId);
      expect(result).toEqual(mockResult);
    });

    it("should throw BadRequestException if user tries to remove someone else's review", async () => {
      const reviewId = 'review-id';
      const userId = 'user-id';

      mockReviewService.remove.mockRejectedValue(new BadRequestException());

      const req = { user: { userId } };

      await expect(controller.remove(req, reviewId)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockReviewService.remove).toHaveBeenCalledWith(reviewId, userId);
    });
  });
});
