import { EntityManager } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTagDto } from './dtos/create-tag.dto';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: EntityRepository<Tag>,
    private readonly em: EntityManager,
  ) {}

  async create(createTagDto: CreateTagDto) {
    const tag = this.tagRepository.create(createTagDto);
    await this.em.persistAndFlush(tag);
    return tag;
  }

  async findAll() {
    return this.tagRepository.findAll();
  }

  async findOne(tagId: string) {
    const tag = await this.tagRepository.findOne({ tagId });

    if (!tag) {
      throw new NotFoundException(`Tag with ID ${tagId} not found`);
    }

    return tag;
  }

  async findByIds(ids: string[]) {
    const tags = await this.tagRepository.find({ tagId: { $in: ids } });

    if (tags.length !== ids.length) {
      const foundIds = tags.map((tag) => tag.tagId);
      const missingIds = ids.filter((id) => !foundIds.includes(id));

      throw new NotFoundException(
        `Tags with IDs ${missingIds.join(', ')} not found`,
      );
    }

    return tags;
  }

  async remove(tagId: string) {
    const tag = await this.findOne(tagId);

    await this.em.removeAndFlush(tag);
    return { success: true };
  }
}
