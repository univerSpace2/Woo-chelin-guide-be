import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { randomUUID } from 'crypto';
import { Place } from '../../place/entities/place.entity';
import { User } from '../../user/entities/user.entity';

@Entity({ tableName: 'reviews' })
export class Review {
  @PrimaryKey({ columnType: 'uuid', fieldName: 'review_id' })
  reviewId: string = randomUUID();

  @Property({ columnType: 'text' })
  comment: string;

  @Property({ fieldName: 'rate' })
  rate: number;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Place)
  place: Place;

  @Property({ fieldName: 'created_at' })
  createdAt: Date = new Date();

  @Property({ fieldName: 'updated_at', onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
