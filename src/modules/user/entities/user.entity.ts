import {
  BeforeCreate,
  BeforeUpdate,
  Entity,
  Index,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

@Entity({ tableName: 'users' })
export class User {
  @PrimaryKey({ columnType: 'uuid', fieldName: 'user_id' })
  userId: string = randomUUID();

  @Property()
  @Unique()
  @Index()
  email: string;

  @Property({ hidden: true })
  password: string;

  @Property({ fieldName: 'anonymous_name' })
  anonymousName: string;

  @Property({ fieldName: 'created_at' })
  createdAt: Date = new Date();

  @Property({ fieldName: 'updated_at', onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @BeforeCreate()
  @BeforeUpdate()
  async hashPassword() {
    // 비밀번호가 변경된 경우에만 해시 처리
    if (this.password && this.password.length < 60) {
      const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
