import {
  Collection,
  Entity,
  Enum,
  Index,
  ManyToMany,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { randomUUID } from 'crypto';
import { Review } from '../../review/entities/review.entity';
import { Tag } from '../../tag/entities/tag.entity';

export enum PlaceCategory {
  LUNCH = '점심',
  DINNER = '회식',
  CAFE = '카페',
}

@Entity({ tableName: 'places' })
export class Place {
  @PrimaryKey({ columnType: 'uuid', fieldName: 'place_id' })
  placeId: string = randomUUID();

  @Property({ fieldName: 'place_name' })
  placeName: string;

  @Enum(() => PlaceCategory)
  category: PlaceCategory;

  @Property({ fieldName: 'avg_rate', default: 0 })
  avgRate: number;

  @Property()
  @Index()
  latitude: number;

  @Property()
  @Index()
  longitude: number;

  @Property({ fieldName: 'created_at' })
  createdAt: Date = new Date();

  @Property({ fieldName: 'updated_at', onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @ManyToMany(() => Tag)
  tags = new Collection<Tag>(this);

  @OneToMany(() => Review, (review) => review.place)
  reviews = new Collection<Review>(this);
}
