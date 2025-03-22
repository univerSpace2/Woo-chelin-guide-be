import { EntityManager } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './dtos';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    private readonly em: EntityManager,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    // 이메일 중복 확인
    const existingUser = await this.userRepository.findOne({
      email: createUserDto.email,
    });
    if (existingUser) {
      throw new ConflictException('이미 사용 중인 이메일입니다.');
    }

    const user = this.userRepository.create({
      email: createUserDto.email,
      password: createUserDto.password,
      anonymousName: createUserDto.anonymousName,
    });

    await this.em.persistAndFlush(user);
    return new UserResponseDto(user);
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.findAll();
    return users.map((user) => new UserResponseDto(user));
  }

  async findOne(userId: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({ userId });
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }
    return new UserResponseDto(user);
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ email });
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }
    return user;
  }

  async update(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({ userId });
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    // 이메일 변경 시 중복 확인
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        email: updateUserDto.email,
      });
      if (existingUser) {
        throw new ConflictException('이미 사용 중인 이메일입니다.');
      }
    }

    this.em.assign(user, updateUserDto);
    await this.em.flush();

    return new UserResponseDto(user);
  }

  async remove(userId: string): Promise<void> {
    const user = await this.userRepository.findOne({ userId });
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    await this.em.removeAndFlush(user);
  }
}
