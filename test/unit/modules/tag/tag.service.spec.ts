import { EntityManager } from '@mikro-orm/core';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateTagDto } from '../../../../src/modules/tag/dtos/create-tag.dto';
import { Tag } from '../../../../src/modules/tag/entities/tag.entity';
import { TagService } from '../../../../src/modules/tag/tag.service';

describe('TagService', () => {
  let service: TagService;
  let mockRepository: any;
  let mockEntityManager: any;

  beforeEach(async () => {
    mockRepository = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      find: jest.fn(),
    };

    mockEntityManager = {
      persistAndFlush: jest.fn(),
      removeAndFlush: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TagService,
        {
          provide: getRepositoryToken(Tag),
          useValue: mockRepository,
        },
        {
          provide: EntityManager,
          useValue: mockEntityManager,
        },
      ],
    }).compile();

    service = module.get<TagService>(TagService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new tag', async () => {
      const createTagDto: CreateTagDto = { tag: '맛있는' };
      const createdTag = { tagId: '1', tag: '맛있는' };

      mockRepository.create.mockReturnValue(createdTag);
      mockEntityManager.persistAndFlush.mockResolvedValue(undefined);

      const result = await service.create(createTagDto);

      expect(mockRepository.create).toHaveBeenCalledWith(createTagDto);
      expect(mockEntityManager.persistAndFlush).toHaveBeenCalledWith(
        createdTag,
      );
      expect(result).toEqual(createdTag);
    });
  });

  describe('findAll', () => {
    it('should return an array of tags', async () => {
      const expectedTags = [
        { tagId: '1', tag: '맛있는' },
        { tagId: '2', tag: '분위기좋은' },
      ];

      mockRepository.findAll.mockResolvedValue(expectedTags);

      const result = await service.findAll();

      expect(mockRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(expectedTags);
    });
  });

  describe('findOne', () => {
    it('should return a tag by id', async () => {
      const tagId = '1';
      const expectedTag = { tagId, tag: '맛있는' };

      mockRepository.findOne.mockResolvedValue(expectedTag);

      const result = await service.findOne(tagId);

      expect(mockRepository.findOne).toHaveBeenCalledWith({ tagId });
      expect(result).toEqual(expectedTag);
    });

    it('should throw NotFoundException if tag not found', async () => {
      const tagId = 'non-existent';

      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(tagId)).rejects.toThrow(NotFoundException);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ tagId });
    });
  });

  describe('remove', () => {
    it('should remove a tag', async () => {
      const tagId = '1';
      const tagToRemove = { tagId, tag: '맛있는' };

      mockRepository.findOne.mockResolvedValue(tagToRemove);
      mockEntityManager.removeAndFlush.mockResolvedValue(undefined);

      const result = await service.remove(tagId);

      expect(mockRepository.findOne).toHaveBeenCalledWith({ tagId });
      expect(mockEntityManager.removeAndFlush).toHaveBeenCalledWith(
        tagToRemove,
      );
      expect(result).toEqual({ success: true });
    });

    it('should throw NotFoundException if tag to remove not found', async () => {
      const tagId = 'non-existent';

      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(tagId)).rejects.toThrow(NotFoundException);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ tagId });
      expect(mockEntityManager.removeAndFlush).not.toHaveBeenCalled();
    });
  });
});
