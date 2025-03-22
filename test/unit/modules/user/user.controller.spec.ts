import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from '../../../../src/common/guards/jwt-auth.guard';
import {
  CreateUserDto,
  UpdateUserDto,
  UserResponseDto,
} from '../../../../src/modules/user/dtos';
import { User } from '../../../../src/modules/user/entities/user.entity';
import { UserController } from '../../../../src/modules/user/user.controller';
import { UserService } from '../../../../src/modules/user/user.service';

describe('UserController', () => {
  let controller: UserController;

  const mockUserService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  // JwtAuthGuard 모킹
  const mockJwtAuthGuard = {
    canActivate: jest.fn(() => {
      return true;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .compile();

    controller = module.get<UserController>(UserController);

    // 테스트 전에 모든 모의 함수 초기화
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      // 준비
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
        anonymousName: '익명사용자',
      };

      // User 객체 생성
      const mockUser = new User();
      mockUser.userId = 'test-uuid';
      mockUser.email = createUserDto.email;
      mockUser.password = createUserDto.password;
      mockUser.anonymousName = createUserDto.anonymousName;
      mockUser.createdAt = new Date();
      mockUser.updatedAt = new Date();

      const mockUserResponse = new UserResponseDto(mockUser);

      mockUserService.create.mockResolvedValue(mockUserResponse);

      // 실행
      const result = await controller.create(createUserDto);

      // 검증
      expect(mockUserService.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual({
        data: mockUserResponse,
        msg: '사용자가 성공적으로 생성되었습니다.',
        meta: {},
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      // 준비
      // User 객체 생성
      const mockUser1 = new User();
      mockUser1.userId = 'user1';
      mockUser1.email = 'user1@example.com';
      mockUser1.password = 'password';
      mockUser1.anonymousName = '익명1';
      mockUser1.createdAt = new Date();
      mockUser1.updatedAt = new Date();

      const mockUser2 = new User();
      mockUser2.userId = 'user2';
      mockUser2.email = 'user2@example.com';
      mockUser2.password = 'password';
      mockUser2.anonymousName = '익명2';
      mockUser2.createdAt = new Date();
      mockUser2.updatedAt = new Date();

      const mockUsers = [
        new UserResponseDto(mockUser1),
        new UserResponseDto(mockUser2),
      ];

      mockUserService.findAll.mockResolvedValue(mockUsers);

      // 실행
      const result = await controller.findAll();

      // 검증
      expect(mockUserService.findAll).toHaveBeenCalled();
      expect(result).toEqual({
        data: mockUsers,
        msg: '사용자 목록을 성공적으로 조회했습니다.',
        meta: {},
      });
    });
  });

  describe('getProfile', () => {
    it('should return the user profile', async () => {
      // 준비
      const userId = 'test-uuid';

      // User 객체 생성
      const mockUser = new User();
      mockUser.userId = userId;
      mockUser.email = 'test@example.com';
      mockUser.password = 'password';
      mockUser.anonymousName = '익명사용자';
      mockUser.createdAt = new Date();
      mockUser.updatedAt = new Date();

      const mockUserProfile = new UserResponseDto(mockUser);

      mockUserService.findOne.mockResolvedValue(mockUserProfile);

      // 실행
      const result = await controller.getProfile(userId);

      // 검증
      expect(mockUserService.findOne).toHaveBeenCalledWith(userId);
      expect(result).toEqual({
        data: mockUserProfile,
        msg: '프로필을 성공적으로 조회했습니다.',
        meta: {},
      });
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      // 준비
      const userId = 'test-uuid';

      // User 객체 생성
      const mockUser = new User();
      mockUser.userId = userId;
      mockUser.email = 'test@example.com';
      mockUser.password = 'password';
      mockUser.anonymousName = '익명사용자';
      mockUser.createdAt = new Date();
      mockUser.updatedAt = new Date();

      const mockUserResponse = new UserResponseDto(mockUser);

      mockUserService.findOne.mockResolvedValue(mockUserResponse);

      // 실행
      const result = await controller.findOne(userId);

      // 검증
      expect(mockUserService.findOne).toHaveBeenCalledWith(userId);
      expect(result).toEqual({
        data: mockUserResponse,
        msg: '사용자를 성공적으로 조회했습니다.',
        meta: {},
      });
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      // 준비
      const userId = 'test-uuid';
      const updateUserDto: UpdateUserDto = {
        anonymousName: '새로운익명',
      };

      // User 객체 생성
      const mockUser = new User();
      mockUser.userId = userId;
      mockUser.email = 'test@example.com';
      mockUser.password = 'password';
      mockUser.anonymousName = updateUserDto.anonymousName;
      mockUser.createdAt = new Date();
      mockUser.updatedAt = new Date();

      const mockUpdatedUser = new UserResponseDto(mockUser);

      mockUserService.update.mockResolvedValue(mockUpdatedUser);

      // 실행
      const result = await controller.update(userId, updateUserDto, userId);

      // 검증
      expect(mockUserService.update).toHaveBeenCalledWith(
        userId,
        updateUserDto,
      );
      expect(result).toEqual({
        data: mockUpdatedUser,
        msg: '사용자 정보가 성공적으로 수정되었습니다.',
        meta: {},
      });
    });

    it('should return forbidden error if user tries to update another user', async () => {
      // 준비
      const userId = 'test-uuid';
      const currentUserId = 'different-uuid';
      const updateUserDto: UpdateUserDto = {
        anonymousName: '새로운익명',
      };

      // 실행
      const result = await controller.update(
        userId,
        updateUserDto,
        currentUserId,
      );

      // 검증
      expect(mockUserService.update).not.toHaveBeenCalled();
      expect(result).toEqual({
        data: null,
        msg: '자신의 정보만 수정할 수 있습니다.',
        meta: { statusCode: 403 },
      });
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      // 준비
      const userId = 'test-uuid';
      mockUserService.remove.mockResolvedValue(undefined);

      // 실행
      const result = await controller.remove(userId, userId);

      // 검증
      expect(mockUserService.remove).toHaveBeenCalledWith(userId);
      expect(result).toEqual({
        data: null,
        msg: '사용자가 성공적으로 삭제되었습니다.',
        meta: {},
      });
    });

    it('should return forbidden error if user tries to remove another user', async () => {
      // 준비
      const userId = 'test-uuid';
      const currentUserId = 'different-uuid';

      // 실행
      const result = await controller.remove(userId, currentUserId);

      // 검증
      expect(mockUserService.remove).not.toHaveBeenCalled();
      expect(result).toEqual({
        data: null,
        msg: '자신의 계정만 삭제할 수 있습니다.',
        meta: { statusCode: 403 },
      });
    });
  });
});
