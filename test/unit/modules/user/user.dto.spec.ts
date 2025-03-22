import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import {
  CreateUserDto,
  UpdateUserDto,
  UserResponseDto,
} from '../../../../src/modules/user/dtos';
import { User } from '../../../../src/modules/user/entities/user.entity';

describe('User DTOs', () => {
  describe('CreateUserDto', () => {
    it('should validate a valid CreateUserDto', async () => {
      // 준비
      const dto = plainToInstance(CreateUserDto, {
        email: 'test@example.com',
        password: 'password123',
        anonymousName: '익명사용자',
      });

      // 실행
      const errors = await validate(dto);

      // 검증
      expect(errors.length).toBe(0);
    });

    it('should fail validation with invalid email', async () => {
      // 준비
      const dto = plainToInstance(CreateUserDto, {
        email: 'invalid-email',
        password: 'password123',
        anonymousName: '익명사용자',
      });

      // 실행
      const errors = await validate(dto);

      // 검증
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('email');
    });

    it('should fail validation with short password', async () => {
      // 준비
      const dto = plainToInstance(CreateUserDto, {
        email: 'test@example.com',
        password: 'short',
        anonymousName: '익명사용자',
      });

      // 실행
      const errors = await validate(dto);

      // 검증
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('password');
    });

    it('should fail validation with missing fields', async () => {
      // 준비
      const dto = plainToInstance(CreateUserDto, {
        email: 'test@example.com',
      });

      // 실행
      const errors = await validate(dto);

      // 검증
      expect(errors.length).toBe(2);
      const properties = errors.map((error) => error.property);
      expect(properties).toContain('password');
      expect(properties).toContain('anonymousName');
    });
  });

  describe('UpdateUserDto', () => {
    it('should validate a valid UpdateUserDto with all fields', async () => {
      // 준비
      const dto = plainToInstance(UpdateUserDto, {
        email: 'updated@example.com',
        password: 'newpassword123',
        anonymousName: '새로운익명',
      });

      // 실행
      const errors = await validate(dto);

      // 검증
      expect(errors.length).toBe(0);
    });

    it('should validate a valid UpdateUserDto with partial fields', async () => {
      // 준비
      const dto = plainToInstance(UpdateUserDto, {
        anonymousName: '새로운익명',
      });

      // 실행
      const errors = await validate(dto);

      // 검증
      expect(errors.length).toBe(0);
    });

    it('should fail validation with invalid email', async () => {
      // 준비
      const dto = plainToInstance(UpdateUserDto, {
        email: 'invalid-email',
      });

      // 실행
      const errors = await validate(dto);

      // 검증
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('email');
    });

    it('should fail validation with short password', async () => {
      // 준비
      const dto = plainToInstance(UpdateUserDto, {
        password: 'short',
      });

      // 실행
      const errors = await validate(dto);

      // 검증
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('password');
    });
  });

  describe('UserResponseDto', () => {
    it('should transform User to UserResponseDto', () => {
      // 준비
      // User 클래스의 인스턴스 생성
      const mockUser = new User();
      mockUser.userId = 'test-uuid';
      mockUser.email = 'test@example.com';
      mockUser.password = 'hashed_password';
      mockUser.anonymousName = '익명사용자';
      mockUser.createdAt = new Date();
      mockUser.updatedAt = new Date();

      // 실행
      const responseDto = new UserResponseDto(mockUser);

      // 검증
      expect(responseDto.userId).toBe(mockUser.userId);
      expect(responseDto.email).toBe(mockUser.email);
      expect(responseDto.anonymousName).toBe(mockUser.anonymousName);
      expect(responseDto.createdAt).toBe(mockUser.createdAt);
      expect(responseDto.updatedAt).toBe(mockUser.updatedAt);

      // password는 제외되어야 함
      expect(responseDto).not.toHaveProperty('password');

      // 메서드는 제외되어야 함
      expect(responseDto).not.toHaveProperty('hashPassword');
      expect(responseDto).not.toHaveProperty('validatePassword');
    });
  });
});
