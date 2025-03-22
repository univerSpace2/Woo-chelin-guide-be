import * as core from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/core';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreatePlaceDto } from '../../../../src/modules/place/dtos/create-place.dto';
import { UpdatePlaceDto } from '../../../../src/modules/place/dtos/update-place.dto';
import {
  Place,
  PlaceCategory,
} from '../../../../src/modules/place/entities/place.entity';
import { PlaceService } from '../../../../src/modules/place/place.service';
import { TagService } from '../../../../src/modules/tag/tag.service';

// 전역 모킹 설정
jest.mock('@mikro-orm/core', () => {
  const originalModule = jest.requireActual('@mikro-orm/core');
  return {
    ...originalModule,
    wrap: jest.fn(),
  };
});

describe('PlaceService', () => {
  let service: PlaceService;
  let mockPlaceRepository: any;
  let mockEntityManager: any;
  let mockTagService: any;

  beforeEach(async () => {
    mockPlaceRepository = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
    };

    mockEntityManager = {
      persistAndFlush: jest.fn(),
      flush: jest.fn(),
      removeAndFlush: jest.fn(),
    };

    mockTagService = {
      findByIds: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlaceService,
        {
          provide: getRepositoryToken(Place),
          useValue: mockPlaceRepository,
        },
        {
          provide: EntityManager,
          useValue: mockEntityManager,
        },
        {
          provide: TagService,
          useValue: mockTagService,
        },
      ],
    }).compile();

    service = module.get<PlaceService>(PlaceService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new place with tags', async () => {
      const createPlaceDto: CreatePlaceDto = {
        placeName: '맛있는 식당',
        category: PlaceCategory.LUNCH,
        latitude: 37.5326,
        longitude: 127.0246,
      };

      const tagIds = ['tag-id-1', 'tag-id-2'];
      const tags = [
        { tagId: 'tag-id-1', tag: '맛있는' },
        { tagId: 'tag-id-2', tag: '분위기좋은' },
      ];

      const createdPlace = {
        placeId: 'place-id',
        placeName: createPlaceDto.placeName,
        category: createPlaceDto.category,
        latitude: createPlaceDto.latitude,
        longitude: createPlaceDto.longitude,
        avgRate: 0,
        tags: { add: jest.fn() },
      };

      mockTagService.findByIds.mockResolvedValue(tags);
      mockPlaceRepository.create.mockReturnValue(createdPlace);
      mockEntityManager.persistAndFlush.mockResolvedValue(undefined);

      const result = await service.create(createPlaceDto, tagIds);

      expect(mockTagService.findByIds).toHaveBeenCalledWith(tagIds);
      expect(mockPlaceRepository.create).toHaveBeenCalledWith(createPlaceDto);
      expect(createdPlace.tags.add).toHaveBeenCalledTimes(tags.length);
      expect(mockEntityManager.persistAndFlush).toHaveBeenCalledWith(
        createdPlace,
      );
      expect(result).toEqual(createdPlace);
    });
  });

  describe('findAll', () => {
    it('should return all places', async () => {
      const places = [
        { placeId: 'place-id-1', placeName: '맛있는 식당' },
        { placeId: 'place-id-2', placeName: '분위기좋은 카페' },
      ];

      mockPlaceRepository.findAll.mockResolvedValue(places);

      const result = await service.findAll();

      expect(mockPlaceRepository.findAll).toHaveBeenCalledWith({
        where: {},
        populate: ['tags'],
      });
      expect(result).toEqual(places);
    });

    it('should return places with filter', async () => {
      const filter = { category: PlaceCategory.LUNCH };
      const places = [
        {
          placeId: 'place-id-1',
          placeName: '맛있는 식당',
          category: PlaceCategory.LUNCH,
        },
      ];

      mockPlaceRepository.findAll.mockResolvedValue(places);

      const result = await service.findAll(filter);

      expect(mockPlaceRepository.findAll).toHaveBeenCalledWith({
        where: filter,
        populate: ['tags'],
      });
      expect(result).toEqual(places);
    });
  });

  describe('findOne', () => {
    it('should return a place by id', async () => {
      const placeId = 'place-id';
      const place = { placeId, placeName: '맛있는 식당' };

      mockPlaceRepository.findOne.mockResolvedValue(place);

      const result = await service.findOne(placeId);

      expect(mockPlaceRepository.findOne).toHaveBeenCalledWith(
        { placeId },
        { populate: ['tags', 'reviews'] },
      );
      expect(result).toEqual(place);
    });

    it('should throw NotFoundException if place not found', async () => {
      const placeId = 'non-existent';

      mockPlaceRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(placeId)).rejects.toThrow(NotFoundException);
      expect(mockPlaceRepository.findOne).toHaveBeenCalledWith(
        { placeId },
        { populate: ['tags', 'reviews'] },
      );
    });
  });

  describe('update', () => {
    it('should update a place', async () => {
      const placeId = 'place-id';
      const updatePlaceDto: UpdatePlaceDto = {
        placeName: '업데이트된 식당',
      };

      const place = {
        placeId,
        placeName: '맛있는 식당',
      };

      mockPlaceRepository.findOne.mockResolvedValue(place);
      mockEntityManager.flush.mockResolvedValue(undefined);

      // wrap 모킹 설정
      const mockAssign = jest.fn();
      (core.wrap as jest.Mock).mockReturnValue({
        assign: mockAssign,
      });

      const result = await service.update(placeId, updatePlaceDto);

      expect(mockPlaceRepository.findOne).toHaveBeenCalledWith(
        { placeId },
        { populate: ['tags', 'reviews'] },
      );
      expect(core.wrap).toHaveBeenCalledWith(place);
      expect(mockAssign).toHaveBeenCalledWith(updatePlaceDto);
      expect(mockEntityManager.flush).toHaveBeenCalled();
      expect(result).toEqual(place);
    });

    it('should throw NotFoundException if place to update not found', async () => {
      const placeId = 'non-existent';
      const updatePlaceDto: UpdatePlaceDto = { placeName: '업데이트된 식당' };

      mockPlaceRepository.findOne.mockResolvedValue(null);

      await expect(service.update(placeId, updatePlaceDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockPlaceRepository.findOne).toHaveBeenCalledWith(
        { placeId },
        { populate: ['tags', 'reviews'] },
      );
    });
  });

  describe('updateTags', () => {
    it('should update tags of a place', async () => {
      const placeId = 'place-id';
      const tagIds = ['tag-id-1', 'tag-id-3'];

      const place = {
        placeId,
        placeName: '맛있는 식당',
        tags: {
          removeAll: jest.fn(),
          add: jest.fn(),
        },
      };

      const tags = [
        { tagId: 'tag-id-1', tag: '맛있는' },
        { tagId: 'tag-id-3', tag: '새로운태그' },
      ];

      mockPlaceRepository.findOne.mockResolvedValue(place);
      mockTagService.findByIds.mockResolvedValue(tags);
      mockEntityManager.flush.mockResolvedValue(undefined);

      const result = await service.updateTags(placeId, tagIds);

      expect(mockPlaceRepository.findOne).toHaveBeenCalledWith(
        { placeId },
        { populate: ['tags', 'reviews'] },
      );
      expect(mockTagService.findByIds).toHaveBeenCalledWith(tagIds);
      expect(place.tags.removeAll).toHaveBeenCalled();
      expect(place.tags.add).toHaveBeenCalledTimes(tags.length);
      expect(mockEntityManager.flush).toHaveBeenCalled();
      expect(result).toEqual(place);
    });
  });

  describe('remove', () => {
    it('should remove a place', async () => {
      const placeId = 'place-id';
      const place = {
        placeId,
        placeName: '맛있는 식당',
      };

      mockPlaceRepository.findOne.mockResolvedValue(place);
      mockEntityManager.removeAndFlush.mockResolvedValue(undefined);

      const result = await service.remove(placeId);

      expect(mockPlaceRepository.findOne).toHaveBeenCalledWith(
        { placeId },
        { populate: ['tags', 'reviews'] },
      );
      expect(mockEntityManager.removeAndFlush).toHaveBeenCalledWith(place);
      expect(result).toEqual({ success: true });
    });

    it('should throw NotFoundException if place to remove not found', async () => {
      const placeId = 'non-existent';

      mockPlaceRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(placeId)).rejects.toThrow(NotFoundException);
      expect(mockPlaceRepository.findOne).toHaveBeenCalledWith(
        { placeId },
        { populate: ['tags', 'reviews'] },
      );
      expect(mockEntityManager.removeAndFlush).not.toHaveBeenCalled();
    });
  });

  describe('updateAvgRate', () => {
    it('should update average rate of a place', async () => {
      const placeId = 'place-id';
      const place = {
        placeId,
        placeName: '맛있는 식당',
        reviews: {
          loadItems: jest.fn().mockResolvedValue([{ rate: 4 }, { rate: 5 }]),
        },
      };

      mockPlaceRepository.findOne.mockResolvedValue(place);
      mockEntityManager.flush.mockResolvedValue(undefined);

      await service.updateAvgRate(placeId);

      expect(mockPlaceRepository.findOne).toHaveBeenCalledWith(
        { placeId },
        { populate: ['tags', 'reviews'] },
      );
      expect(place.reviews.loadItems).toHaveBeenCalled();
      expect(place).toHaveProperty('avgRate', 4.5);
      expect(mockEntityManager.flush).toHaveBeenCalled();
    });

    it('should set avgRate to 0 if there are no reviews', async () => {
      const placeId = 'place-id';
      const place = {
        placeId,
        placeName: '맛있는 식당',
        reviews: {
          loadItems: jest.fn().mockResolvedValue([]),
        },
      };

      mockPlaceRepository.findOne.mockResolvedValue(place);
      mockEntityManager.flush.mockResolvedValue(undefined);

      await service.updateAvgRate(placeId);

      expect(mockPlaceRepository.findOne).toHaveBeenCalledWith(
        { placeId },
        { populate: ['tags', 'reviews'] },
      );
      expect(place.reviews.loadItems).toHaveBeenCalled();
      expect(place).toHaveProperty('avgRate', 0);
      expect(mockEntityManager.flush).toHaveBeenCalled();
    });
  });
});
