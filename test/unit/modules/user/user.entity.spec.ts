import * as bcrypt from 'bcrypt';
import { User } from '../../../../src/modules/user/entities/user.entity';

jest.mock('bcrypt', () => ({
  genSalt: jest.fn().mockResolvedValue('salt'),
  hash: jest.fn().mockResolvedValue('hashed_password'),
  compare: jest.fn().mockResolvedValue(true),
}));

describe('User Entity', () => {
  let user: User;

  beforeEach(() => {
    user = new User();
    user.email = 'test@example.com';
    user.password = 'password123';
    user.anonymousName = '익명사용자';

    // 모의 함수 초기화
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(user).toBeDefined();
    expect(user.userId).toBeDefined();
    expect(user.createdAt).toBeDefined();
    expect(user.updatedAt).toBeDefined();
  });

  describe('hashPassword', () => {
    it('should hash the password', async () => {
      // 실행
      await user.hashPassword();

      // 검증
      expect(bcrypt.genSalt).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 'salt');
      expect(user.password).toBe('hashed_password');
    });

    it('should not hash the password if it is already hashed', async () => {
      // 준비
      user.password =
        'already_hashed_password_with_length_greater_than_60_characters_to_skip_hashing';

      // 실행
      await user.hashPassword();

      // 검증
      expect(bcrypt.genSalt).not.toHaveBeenCalled();
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(user.password).toBe(
        'already_hashed_password_with_length_greater_than_60_characters_to_skip_hashing',
      );
    });
  });

  describe('validatePassword', () => {
    it('should return true for valid password', async () => {
      // 준비
      const password = 'password123';
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);

      // 실행
      const result = await user.validatePassword(password);

      // 검증
      expect(bcrypt.compare).toHaveBeenCalledWith(password, user.password);
      expect(result).toBe(true);
    });

    it('should return false for invalid password', async () => {
      // 준비
      const password = 'wrong_password';
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

      // 실행
      const result = await user.validatePassword(password);

      // 검증
      expect(bcrypt.compare).toHaveBeenCalledWith(password, user.password);
      expect(result).toBe(false);
    });
  });
});
