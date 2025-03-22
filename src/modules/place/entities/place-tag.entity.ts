import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { Tag } from '../../tag/entities/tag.entity';
import { Place } from './place.entity';

@Entity({ tableName: 'places_tags' })
export class PlaceTag {
  @ManyToOne(() => Place, { primary: true })
  place: Place;

  @ManyToOne(() => Tag, { primary: true })
  tag: Tag;

  @Property({ fieldName: 'created_at' })
  createdAt: Date = new Date();
}
