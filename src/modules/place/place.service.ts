import { EntityManager, FilterQuery, wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable, NotFoundException } from '@nestjs/common';
import { TagService } from '../tag/tag.service';
import { CreatePlaceDto } from './dtos/create-place.dto';
import { UpdatePlaceDto } from './dtos/update-place.dto';
import { Place } from './entities/place.entity';

@Injectable()
export class PlaceService {
  constructor(
    @InjectRepository(Place)
    private readonly placeRepository: EntityRepository<Place>,
    private readonly em: EntityManager,
    private readonly tagService: TagService,
  ) {}

  async create(createPlaceDto: CreatePlaceDto, tagIds?: string[]) {
    const place = this.placeRepository.create(createPlaceDto);

    if (tagIds && tagIds.length > 0) {
      const tags = await this.tagService.findByIds(tagIds);
      for (const tag of tags) {
        place.tags.add(tag);
      }
    }

    await this.em.persistAndFlush(place);
    return place;
  }

  async findAll(filter: FilterQuery<Place> = {}) {
    return this.placeRepository.findAll({
      where: filter,
      populate: ['tags'],
    });
  }

  async findOne(placeId: string) {
    const place = await this.placeRepository.findOne(
      { placeId },
      { populate: ['tags', 'reviews'] },
    );

    if (!place) {
      throw new NotFoundException(`Place with ID ${placeId} not found`);
    }

    return place;
  }

  async update(placeId: string, updatePlaceDto: UpdatePlaceDto) {
    const place = await this.findOne(placeId);

    wrap(place).assign(updatePlaceDto);
    await this.em.flush();

    return place;
  }

  async updateTags(placeId: string, tagIds: string[]) {
    const place = await this.findOne(placeId);
    const tags = await this.tagService.findByIds(tagIds);

    place.tags.removeAll();
    for (const tag of tags) {
      place.tags.add(tag);
    }

    await this.em.flush();
    return place;
  }

  async remove(placeId: string) {
    const place = await this.findOne(placeId);

    await this.em.removeAndFlush(place);
    return { success: true };
  }

  async updateAvgRate(placeId: string) {
    const place = await this.findOne(placeId);
    const reviews = await place.reviews.loadItems();

    if (reviews.length === 0) {
      place.avgRate = 0;
    } else {
      const totalRate = reviews.reduce((sum, review) => sum + review.rate, 0);
      place.avgRate = parseFloat((totalRate / reviews.length).toFixed(1));
    }

    await this.em.flush();
    return place;
  }
}
