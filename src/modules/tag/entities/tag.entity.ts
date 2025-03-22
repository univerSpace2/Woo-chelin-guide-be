import {
  Collection,
  Entity,
  ManyToMany,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { randomUUID } from 'crypto';
import { Place } from '../../place/entities/place.entity';

@Entity({ tableName: 'tags' })
export class Tag {
  @PrimaryKey({ columnType: 'uuid', fieldName: 'tag_id' })
  tagId: string = randomUUID();

  @Property()
  @Unique()
  tag: string;

  @ManyToMany(() => Place, (place) => place.tags)
  places = new Collection<Place>(this);
}
