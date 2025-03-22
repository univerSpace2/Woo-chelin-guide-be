import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreatePlaceDto } from './dtos/create-place.dto';
import { UpdatePlaceDto } from './dtos/update-place.dto';
import { PlaceService } from './place.service';

@Controller('places')
export class PlaceController {
  constructor(private readonly placeService: PlaceService) {}

  @Post()
  create(
    @Body() createPlaceDto: CreatePlaceDto,
    @Query('tagIds') tagIds?: string,
  ) {
    const tagIdsArray = tagIds ? tagIds.split(',') : [];
    return this.placeService.create(createPlaceDto, tagIdsArray);
  }

  @Get()
  findAll() {
    return this.placeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.placeService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlaceDto: UpdatePlaceDto) {
    return this.placeService.update(id, updatePlaceDto);
  }

  @Patch(':id/tags')
  updateTags(@Param('id') id: string, @Body('tagIds') tagIds: string[]) {
    return this.placeService.updateTags(id, tagIds);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.placeService.remove(id);
  }
}
