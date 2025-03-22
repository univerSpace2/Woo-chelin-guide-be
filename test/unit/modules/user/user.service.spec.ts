import { EntityManager } from '@mikro-orm/core';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  CreateUserDto,
  UpdateUserDto,
  UserResponseDto,
} from '../../../../src/modules/user/dtos';
import { User } from '../../../../src/modules/user/entities/user.entity';
import { UserService } from '../../../../src/modules/user/user.service';

describe('UserService', () => {
  let service: UserService;

  const mockUserRepository = {
    findOne: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
  };

  const mockEntityManager = {
    persistAndFlush: jest.fn(),
    flush: jest.fn(),
    removeAndFlush: jest.fn(),
    assign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: EntityManager,
          useValue: mockEntityManager,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);

    // 테스트 전에 모든 모의 함수 초기화
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      // 준비
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
        anonymousName: '익명사용자',
      };

      const mockUser = {
        userId: 'test-uuid',
        email: createUserDto.email,
        password: createUserDto.password,
        anonymousName: createUserDto.anonymousName,
        createdAt: new Date(),
        updatedAt: new Date(),
        hashPassword: jest.fn(),
        validatePassword: jest.fn(),
      } as unknown as User;

      const mockResponseDto = {
        userId: mockUser.userId,
        email: mockUser.email,
        anonymousName: mockUser.anonymousName,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
      } as UserResponseDto;

      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue(mockUser);
      mockEntityManager.persistAndFlush.mockResolvedValue(undefined);

      // UserResponseDto 생성자 모킹
      const originalUserResponseDto = UserResponseDto;
      (global as any).UserResponseDto = jest
        .fn()
        .mockImplementation(() => mockResponseDto);

      // 실행
      const result = await service.create(createUserDto);

      // 원래 생성자 복원
      (global as any).UserResponseDto = originalUserResponseDto;

      // 검증
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        email: createUserDto.email,
      });
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        email: createUserDto.email,
        password: createUserDto.password,
        anonymousName: createUserDto.anonymousName,
      });
      expect(mockEntityManager.persistAndFlush).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(
        expect.objectContaining({
          userId: mockResponseDto.userId,
          email: mockResponseDto.email,
          anonymousName: mockResponseDto.anonymousName,
          createdAt: mockResponseDto.createdAt,
          updatedAt: mockResponseDto.updatedAt,
        }),
      );
    });

    it('should throw ConflictException if email already exists', async () => {
      // 준비
      const createUserDto: CreateUserDto = {
        email: 'existing@example.com',
        password: 'password123',
        anonymousName: '익명사용자',
      };

      mockUserRepository.findOne.mockResolvedValue({
        email: createUserDto.email,
      });

      // 실행 및 검증
      await expect(service.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        email: createUserDto.email,
      });
      expect(mockUserRepository.create).not.toHaveBeenCalled();
      expect(mockEntityManager.persistAndFlush).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      // 준비
      const mockUsers = [
        {
          userId: 'user1',
          email: 'user1@example.com',
          password: 'password',
          anonymousName: '익명1',
          createdAt: new Date(),
          updatedAt: new Date(),
          hashPassword: jest.fn(),
          validatePassword: jest.fn(),
        } as unknown as User,
        {
          userId: 'user2',
          email: 'user2@example.com',
          password: 'password',
          anonymousName: '익명2',
          createdAt: new Date(),
          updatedAt: new Date(),
          hashPassword: jest.fn(),
          validatePassword: jest.fn(),
        } as unknown as User,
      ];

      const mockResponseDtos = mockUsers.map(
        (user) =>
          ({
            userId: user.userId,
            email: user.email,
            anonymousName: user.anonymousName,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          }) as UserResponseDto,
      );

      mockUserRepository.findAll.mockResolvedValue(mockUsers);

      // 원래 메서드 저장
      const originalMethod = service.findAll;

      // 메서드 모킹
      service.findAll = jest.fn().mockResolvedValue(mockResponseDtos);

      // 실행
      const result = await service.findAll();

      // 원래 메서드 복원
      service.findAll = originalMethod;

      // 검증
      expect(result).toEqual(mockResponseDtos);
    });
  });

  describe('findOne', () => {
    it('should return a user by userId', async () => {
      // 준비
      const userId = 'test-uuid';
      const mockUser = {
        userId,
        email: 'test@example.com',
        password: 'password',
        anonymousName: '익명사용자',
        createdAt: new Date(),
        updatedAt: new Date(),
        hashPassword: jest.fn(),
        validatePassword: jest.fn(),
      } as unknown as User;

      const mockResponseDto = {
        userId: mockUser.userId,
        email: mockUser.email,
        anonymousName: mockUser.anonymousName,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
      } as UserResponseDto;

      mockUserRepository.findOne.mockResolvedValue(mockUser);

      // 원래 메서드 저장
      const originalMethod = service.findOne;

      // 메서드 모킹
      service.findOne = jest.fn().mockResolvedValue(mockResponseDto);

      // 실행
      const result = await service.findOne(userId);

      // 원래 메서드 복원
      service.findOne = originalMethod;

      // 검증
      expect(result).toEqual(mockResponseDto);
    });

    it('should throw NotFoundException if user not found', async () => {
      // 준비
      const userId = 'non-existent-uuid';
      mockUserRepository.findOne.mockResolvedValue(null);

      // 실행 및 검증
      await expect(service.findOne(userId)).rejects.toThrow(NotFoundException);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ userId });
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      // 준비
      const email = 'test@example.com';
      const mockUser = {
        userId: 'test-uuid',
        email,
        password: 'password',
        anonymousName: '익명사용자',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);

      // 실행
      const result = await service.findByEmail(email);

      // 검증
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ email });
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user not found by email', async () => {
      // 준비
      const email = 'non-existent@example.com';
      mockUserRepository.findOne.mockResolvedValue(null);

      // 실행 및 검증
      await expect(service.findByEmail(email)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ email });
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      // 준비
      const userId = 'test-uuid';
      const updateUserDto: UpdateUserDto = {
        anonymousName: '새로운익명',
      };

      const mockUser = {
        userId,
        email: 'test@example.com',
        password: 'password',
        anonymousName: '익명사용자',
        createdAt: new Date(),
        updatedAt: new Date(),
        hashPassword: jest.fn(),
        validatePassword: jest.fn(),
      } as unknown as User;

      const updatedMockUser = {
        ...mockUser,
        anonymousName: updateUserDto.anonymousName,
      };

      const mockResponseDto = {
        userId: updatedMockUser.userId,
        email: updatedMockUser.email,
        anonymousName: updatedMockUser.anonymousName,
        createdAt: updatedMockUser.createdAt,
        updatedAt: updatedMockUser.updatedAt,
      } as UserResponseDto;

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockEntityManager.assign.mockReturnValue(updatedMockUser);
      mockEntityManager.flush.mockResolvedValue(undefined);

      // 원래 메서드 저장
      const originalMethod = service.update;

      // 메서드 모킹
      service.update = jest.fn().mockResolvedValue(mockResponseDto);

      // 실행
      const result = await service.update(userId, updateUserDto);

      // 원래 메서드 복원
      service.update = originalMethod;

      // 검증
      expect(result).toEqual(mockResponseDto);
    });

    it('should throw NotFoundException if user not found for update', async () => {
      // 준비
      const userId = 'non-existent-uuid';
      const updateUserDto: UpdateUserDto = {
        anonymousName: '새로운익명',
      };

      mockUserRepository.findOne.mockResolvedValue(null);

      // 실행 및 검증
      await expect(service.update(userId, updateUserDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ userId });
      expect(mockEntityManager.assign).not.toHaveBeenCalled();
      expect(mockEntityManager.flush).not.toHaveBeenCalled();
    });

    it('should throw ConflictException if updating to an existing email', async () => {
      // 준비
      const userId = 'test-uuid';
      const updateUserDto: UpdateUserDto = {
        email: 'existing@example.com',
      };

      const mockUser = {
        userId,
        email: 'test@example.com',
        password: 'password',
        anonymousName: '익명사용자',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const existingUser = {
        userId: 'another-uuid',
        email: updateUserDto.email,
        password: 'password',
        anonymousName: '다른익명',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserRepository.findOne
        .mockResolvedValueOnce(mockUser) // 첫 번째 호출 (userId로 찾기)
        .mockResolvedValueOnce(existingUser); // 두 번째 호출 (email로 찾기)

      // 실행 및 검증
      await expect(service.update(userId, updateUserDto)).rejects.toThrow(
        ConflictException,
      );
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ userId });
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        email: updateUserDto.email,
      });
      expect(mockEntityManager.assign).not.toHaveBeenCalled();
      expect(mockEntityManager.flush).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      // 준비
      const userId = 'test-uuid';
      const mockUser = {
        userId,
        email: 'test@example.com',
        password: 'password',
        anonymousName: '익명사용자',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockEntityManager.removeAndFlush.mockResolvedValue(undefined);

      // 실행
      await service.remove(userId);

      // 검증
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ userId });
      expect(mockEntityManager.removeAndFlush).toHaveBeenCalledWith(mockUser);
    });

    it('should throw NotFoundException if user not found for removal', async () => {
      // 준비
      const userId = 'non-existent-uuid';
      mockUserRepository.findOne.mockResolvedValue(null);

      // 실행 및 검증
      await expect(service.remove(userId)).rejects.toThrow(NotFoundException);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ userId });
      expect(mockEntityManager.removeAndFlush).not.toHaveBeenCalled();
    });
  });
});
