import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { createSuccessResponse } from '../../common/utils/response.util';
import { CreateUserDto, UpdateUserDto } from './dtos';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    return createSuccessResponse(user, '사용자가 성공적으로 생성되었습니다.');
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    const users = await this.userService.findAll();
    return createSuccessResponse(
      users,
      '사용자 목록을 성공적으로 조회했습니다.',
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@CurrentUser('id') userId: string) {
    const userProfile = await this.userService.findOne(userId);
    return createSuccessResponse(
      userProfile,
      '프로필을 성공적으로 조회했습니다.',
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const user = await this.userService.findOne(id);
    return createSuccessResponse(user, '사용자를 성공적으로 조회했습니다.');
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser('id') userId: string,
  ) {
    // 자신의 정보만 수정 가능하도록 체크
    if (userId !== id) {
      return createSuccessResponse(null, '자신의 정보만 수정할 수 있습니다.', {
        statusCode: 403,
      });
    }

    const updatedUser = await this.userService.update(id, updateUserDto);
    return createSuccessResponse(
      updatedUser,
      '사용자 정보가 성공적으로 수정되었습니다.',
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
  ) {
    // 자신의 계정만 삭제 가능하도록 체크
    if (userId !== id) {
      return createSuccessResponse(null, '자신의 계정만 삭제할 수 있습니다.', {
        statusCode: 403,
      });
    }

    await this.userService.remove(id);
    return createSuccessResponse(null, '사용자가 성공적으로 삭제되었습니다.');
  }
}
