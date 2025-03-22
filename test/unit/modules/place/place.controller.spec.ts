import { Test, TestingModule } from '@nestjs/testing';
import { CreatePlaceDto } from '../../../../src/modules/place/dtos/create-place.dto';
import { UpdatePlaceDto } from '../../../../src/modules/place/dtos/update-place.dto';
import { PlaceCategory } from '../../../../src/modules/place/entities/place.entity';
import { PlaceController } from '../../../../src/modules/place/place.controller';
import { PlaceService } from '../../../../src/modules/place/place.service';

describe('PlaceController', () => {
  let controller: PlaceController;

  const mockPlaceService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    updateTags: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlaceController],
      providers: [
        {
          provide: PlaceService,
          useValue: mockPlaceService,
        },
      ],
    }).compile();

    controller = module.get<PlaceController>(PlaceController);

    // 테스트 전에 모든 모의 함수 초기화
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('태그 없이 장소를 생성해야 합니다', async () => {
      const createPlaceDto: CreatePlaceDto = {
        placeName: '테스트 식당',
        category: PlaceCategory.LUNCH,
        latitude: 37.5326,
        longitude: 127.0246,
      };

      const expectedResult = {
        placeId: 'place-id',
        ...createPlaceDto,
        avgRate: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPlaceService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createPlaceDto);

      expect(mockPlaceService.create).toHaveBeenCalledWith(createPlaceDto, []);
      expect(result).toEqual(expectedResult);
    });

    it('태그와 함께 장소를 생성해야 합니다', async () => {
      const createPlaceDto: CreatePlaceDto = {
        placeName: '테스트 식당',
        category: PlaceCategory.LUNCH,
        latitude: 37.5326,
        longitude: 127.0246,
      };

      const tagIds = 'tag-id-1,tag-id-2';

      const expectedResult = {
        placeId: 'place-id',
        ...createPlaceDto,
        avgRate: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: [
          { tagId: 'tag-id-1', tag: '맛있는' },
          { tagId: 'tag-id-2', tag: '분위기좋은' },
        ],
      };

      mockPlaceService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createPlaceDto, tagIds);

      expect(mockPlaceService.create).toHaveBeenCalledWith(createPlaceDto, [
        'tag-id-1',
        'tag-id-2',
      ]);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAll', () => {
    it('모든 장소를 반환해야 합니다', async () => {
      const expectedResult = [
        {
          placeId: 'place-id-1',
          placeName: '테스트 식당 1',
          category: PlaceCategory.LUNCH,
        },
        {
          placeId: 'place-id-2',
          placeName: '테스트 식당 2',
          category: PlaceCategory.DINNER,
        },
      ];

      mockPlaceService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(mockPlaceService.findAll).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('특정 ID의 장소를 반환해야 합니다', async () => {
      const placeId = 'place-id';
      const expectedResult = {
        placeId,
        placeName: '테스트 식당',
        category: PlaceCategory.LUNCH,
      };

      mockPlaceService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne(placeId);

      expect(mockPlaceService.findOne).toHaveBeenCalledWith(placeId);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('update', () => {
    it('장소 정보를 업데이트해야 합니다', async () => {
      const placeId = 'place-id';
      const updatePlaceDto: UpdatePlaceDto = {
        placeName: '업데이트된 식당 이름',
      };

      const expectedResult = {
        placeId,
        placeName: updatePlaceDto.placeName,
        category: PlaceCategory.LUNCH,
      };

      mockPlaceService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(placeId, updatePlaceDto);

      expect(mockPlaceService.update).toHaveBeenCalledWith(
        placeId,
        updatePlaceDto,
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe('updateTags', () => {
    it('장소의 태그를 업데이트해야 합니다', async () => {
      const placeId = 'place-id';
      const tagIds = ['tag-id-1', 'tag-id-2'];

      const expectedResult = {
        placeId,
        placeName: '테스트 식당',
        tags: [
          { tagId: 'tag-id-1', tag: '맛있는' },
          { tagId: 'tag-id-2', tag: '분위기좋은' },
        ],
      };

      mockPlaceService.updateTags.mockResolvedValue(expectedResult);

      const result = await controller.updateTags(placeId, tagIds);

      expect(mockPlaceService.updateTags).toHaveBeenCalledWith(placeId, tagIds);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('remove', () => {
    it('장소를 삭제해야 합니다', async () => {
      const placeId = 'place-id';
      const expectedResult = { success: true };

      mockPlaceService.remove.mockResolvedValue(expectedResult);

      const result = await controller.remove(placeId);

      expect(mockPlaceService.remove).toHaveBeenCalledWith(placeId);
      expect(result).toEqual(expectedResult);
    });
  });
});
