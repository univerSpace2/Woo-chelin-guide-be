import { EntityManager } from '@mikro-orm/core';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PlaceService } from '../../../../src/modules/place/place.service';
import { CreateReviewDto } from '../../../../src/modules/review/dtos/create-review.dto';
import { UpdateReviewDto } from '../../../../src/modules/review/dtos/update-review.dto';
import { Review } from '../../../../src/modules/review/entities/review.entity';
import { ReviewService } from '../../../../src/modules/review/review.service';

describe('ReviewService', () => {
  let service: ReviewService;

  const mockReviewRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
  };

  const mockEntityManager = {
    persistAndFlush: jest.fn(),
    flush: jest.fn(),
    removeAndFlush: jest.fn(),
    assign: jest.fn(),
  };

  const mockPlaceService = {
    findOne: jest.fn(),
    updateAvgRate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewService,
        {
          provide: getRepositoryToken(Review),
          useValue: mockReviewRepository,
        },
        {
          provide: EntityManager,
          useValue: mockEntityManager,
        },
        {
          provide: PlaceService,
          useValue: mockPlaceService,
        },
      ],
    }).compile();

    service = module.get<ReviewService>(ReviewService);

    // 테스트 전에 모든 모의 함수 초기화
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('새로운 리뷰를 생성해야 합니다', async () => {
      const userId = 'user-id';
      const createReviewDto: CreateReviewDto = {
        comment: '맛있어요!',
        rate: 5,
        placeId: 'place-id',
      };

      // Mock 데이터 설정
      const mockPlace = { placeId: 'place-id', name: '맛있는 식당' };
      const mockReview = {
        reviewId: 'review-id',
        comment: '맛있어요!',
        rate: 5,
        user: { userId },
        place: mockPlace,
      };

      mockPlaceService.findOne.mockResolvedValue(mockPlace);
      mockReviewRepository.create.mockReturnValue(mockReview);
      mockEntityManager.persistAndFlush.mockResolvedValue(undefined);
      mockPlaceService.updateAvgRate.mockResolvedValue(undefined);

      const result = await service.create(userId, createReviewDto);

      expect(mockPlaceService.findOne).toHaveBeenCalledWith(
        createReviewDto.placeId,
      );
      expect(mockReviewRepository.create).toHaveBeenCalledWith({
        comment: createReviewDto.comment,
        rate: createReviewDto.rate,
        user: { userId },
        place: mockPlace,
      });
      expect(mockEntityManager.persistAndFlush).toHaveBeenCalledWith(
        mockReview,
      );
      expect(mockPlaceService.updateAvgRate).toHaveBeenCalledWith(
        createReviewDto.placeId,
      );
      expect(result).toEqual(mockReview);
    });
  });

  describe('findAll', () => {
    it('모든 리뷰를 반환해야 합니다', async () => {
      const mockReviews = [
        { reviewId: 'review-1', comment: '맛있어요!', rate: 5 },
        { reviewId: 'review-2', comment: '좋아요!', rate: 4 },
      ];

      mockReviewRepository.find.mockResolvedValue(mockReviews);

      const result = await service.findAll();

      expect(mockReviewRepository.find).toHaveBeenCalledWith(
        {},
        {
          populate: ['user', 'place'],
        },
      );
      expect(result).toEqual(mockReviews);
    });

    it('특정 사용자의 리뷰를 반환해야 합니다', async () => {
      const userId = 'user-id';
      const mockReviews = [
        {
          reviewId: 'review-1',
          comment: '맛있어요!',
          rate: 5,
          user: { userId },
        },
      ];

      mockReviewRepository.find.mockResolvedValue(mockReviews);

      const result = await service.findAll(userId);

      expect(mockReviewRepository.find).toHaveBeenCalledWith(
        { user: { userId } },
        { populate: ['user', 'place'] },
      );
      expect(result).toEqual(mockReviews);
    });

    it('특정 장소의 리뷰를 반환해야 합니다', async () => {
      const placeId = 'place-id';
      const mockReviews = [
        {
          reviewId: 'review-1',
          comment: '맛있어요!',
          rate: 5,
          place: { placeId },
        },
      ];

      mockReviewRepository.find.mockResolvedValue(mockReviews);

      const result = await service.findAll(undefined, placeId);

      expect(mockReviewRepository.find).toHaveBeenCalledWith(
        { place: { placeId } },
        { populate: ['user', 'place'] },
      );
      expect(result).toEqual(mockReviews);
    });
  });

  describe('findOne', () => {
    it('존재하는 리뷰를 반환해야 합니다', async () => {
      const reviewId = 'review-id';
      const mockReview = {
        reviewId,
        comment: '맛있어요!',
        rate: 5,
        user: { userId: 'user-id' },
        place: { placeId: 'place-id' },
      };

      mockReviewRepository.findOne.mockResolvedValue(mockReview);

      const result = await service.findOne(reviewId);

      expect(mockReviewRepository.findOne).toHaveBeenCalledWith(
        { reviewId },
        { populate: ['user', 'place'] },
      );
      expect(result).toEqual(mockReview);
    });

    it('존재하지 않는 리뷰에 대해 NotFoundException을 발생시켜야 합니다', async () => {
      const reviewId = 'non-existent';

      mockReviewRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(reviewId)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockReviewRepository.findOne).toHaveBeenCalledWith(
        { reviewId },
        { populate: ['user', 'place'] },
      );
    });
  });

  describe('update', () => {
    it('리뷰 작성자가 본인인 경우 리뷰를 업데이트해야 합니다', async () => {
      const reviewId = 'review-id';
      const userId = 'user-id';
      const updateReviewDto: UpdateReviewDto = {
        comment: '정말 맛있어요!',
        rate: 5,
      };

      const mockReview = {
        reviewId,
        comment: '맛있어요!',
        rate: 4,
        user: { userId },
        place: { placeId: 'place-id' },
      };

      mockReviewRepository.findOne.mockResolvedValue(mockReview);
      mockEntityManager.flush.mockResolvedValue(undefined);
      mockPlaceService.updateAvgRate.mockResolvedValue(undefined);

      const result = await service.update(reviewId, userId, updateReviewDto);

      expect(mockReviewRepository.findOne).toHaveBeenCalledWith(
        { reviewId },
        { populate: ['user', 'place'] },
      );
      expect(mockEntityManager.assign).toHaveBeenCalledWith(
        mockReview,
        updateReviewDto,
      );
      expect(mockEntityManager.flush).toHaveBeenCalled();
      expect(mockPlaceService.updateAvgRate).toHaveBeenCalledWith(
        mockReview.place.placeId,
      );
      expect(result).toEqual(mockReview);
    });

    it('리뷰 작성자가 본인이 아닌 경우 BadRequestException을 발생시켜야 합니다', async () => {
      const reviewId = 'review-id';
      const userId = 'different-user-id';
      const updateReviewDto: UpdateReviewDto = {
        comment: '정말 맛있어요!',
      };

      const mockReview = {
        reviewId,
        comment: '맛있어요!',
        rate: 4,
        user: { userId: 'original-user-id' },
        place: { placeId: 'place-id' },
      };

      mockReviewRepository.findOne.mockResolvedValue(mockReview);

      await expect(
        service.update(reviewId, userId, updateReviewDto),
      ).rejects.toThrow(BadRequestException);
      expect(mockReviewRepository.findOne).toHaveBeenCalledWith(
        { reviewId },
        { populate: ['user', 'place'] },
      );
      expect(mockEntityManager.assign).not.toHaveBeenCalled();
      expect(mockEntityManager.flush).not.toHaveBeenCalled();
      expect(mockPlaceService.updateAvgRate).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('리뷰 작성자가 본인인 경우 리뷰를 삭제해야 합니다', async () => {
      const reviewId = 'review-id';
      const userId = 'user-id';

      const mockReview = {
        reviewId,
        comment: '맛있어요!',
        rate: 4,
        user: { userId },
        place: { placeId: 'place-id' },
      };

      mockReviewRepository.findOne.mockResolvedValue(mockReview);
      mockEntityManager.removeAndFlush.mockResolvedValue(undefined);
      mockPlaceService.updateAvgRate.mockResolvedValue(undefined);

      const result = await service.remove(reviewId, userId);

      expect(mockReviewRepository.findOne).toHaveBeenCalledWith(
        { reviewId },
        { populate: ['user', 'place'] },
      );
      expect(mockEntityManager.removeAndFlush).toHaveBeenCalledWith(mockReview);
      expect(mockPlaceService.updateAvgRate).toHaveBeenCalledWith(
        mockReview.place.placeId,
      );
      expect(result).toEqual({ success: true });
    });

    it('리뷰 작성자가 본인이 아닌 경우 BadRequestException을 발생시켜야 합니다', async () => {
      const reviewId = 'review-id';
      const userId = 'different-user-id';

      const mockReview = {
        reviewId,
        comment: '맛있어요!',
        rate: 4,
        user: { userId: 'original-user-id' },
        place: { placeId: 'place-id' },
      };

      mockReviewRepository.findOne.mockResolvedValue(mockReview);

      await expect(service.remove(reviewId, userId)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockReviewRepository.findOne).toHaveBeenCalledWith(
        { reviewId },
        { populate: ['user', 'place'] },
      );
      expect(mockEntityManager.removeAndFlush).not.toHaveBeenCalled();
      expect(mockPlaceService.updateAvgRate).not.toHaveBeenCalled();
    });
  });
});
