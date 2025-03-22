import { Collection } from '@mikro-orm/core';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateTagDto } from '../../../../src/modules/tag/dtos/create-tag.dto';
import { Tag } from '../../../../src/modules/tag/entities/tag.entity';
import { TagController } from '../../../../src/modules/tag/tag.controller';
import { TagService } from '../../../../src/modules/tag/tag.service';

describe('TagController', () => {
  let controller: TagController;

  const mockTagService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TagController],
      providers: [
        {
          provide: TagService,
          useValue: mockTagService,
        },
      ],
    }).compile();

    controller = module.get<TagController>(TagController);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new tag', async () => {
      const createTagDto: CreateTagDto = { tag: '맛있는' };
      const expectedTag = {
        tagId: '1',
        tag: '맛있는',
        places: new Collection<any>(null),
      } as unknown as Tag;

      mockTagService.create.mockResolvedValue(expectedTag);

      const result = await controller.create(createTagDto);

      expect(result).toEqual(expectedTag);
      expect(mockTagService.create).toHaveBeenCalledWith(createTagDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of tags', async () => {
      const expectedTags = [
        {
          tagId: '1',
          tag: '맛있는',
          places: new Collection<any>(null),
        },
        {
          tagId: '2',
          tag: '분위기좋은',
          places: new Collection<any>(null),
        },
      ] as unknown as Tag[];

      mockTagService.findAll.mockResolvedValue(expectedTags);

      const result = await controller.findAll();

      expect(result).toEqual(expectedTags);
      expect(mockTagService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a tag by id', async () => {
      const tagId = '1';
      const expectedTag = {
        tagId: '1',
        tag: '맛있는',
        places: new Collection<any>(null),
      } as unknown as Tag;

      mockTagService.findOne.mockResolvedValue(expectedTag);

      const result = await controller.findOne(tagId);

      expect(result).toEqual(expectedTag);
      expect(mockTagService.findOne).toHaveBeenCalledWith(tagId);
    });

    it('should throw an error if tag is not found', async () => {
      const tagId = 'nonexistent';

      mockTagService.findOne.mockRejectedValue(new NotFoundException());

      await expect(controller.findOne(tagId)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockTagService.findOne).toHaveBeenCalledWith(tagId);
    });
  });

  describe('remove', () => {
    it('should remove a tag', async () => {
      const tagId = '1';
      const expectedResult = { success: true };

      mockTagService.remove.mockResolvedValue(expectedResult);

      const result = await controller.remove(tagId);

      expect(result).toEqual(expectedResult);
      expect(mockTagService.remove).toHaveBeenCalledWith(tagId);
    });
  });
});
