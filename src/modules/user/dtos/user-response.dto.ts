import { Exclude, Expose } from 'class-transformer';
import { User } from '../entities/user.entity';

export class UserResponseDto {
  @Expose()
  userId: string;

  @Expose()
  email: string;

  @Exclude()
  password: string;

  @Expose()
  anonymousName: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  constructor(user: User) {
    Object.assign(this, user);
    delete this.password;
  }
}
