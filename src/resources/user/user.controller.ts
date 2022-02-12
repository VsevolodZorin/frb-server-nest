import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from '@src/resources/user/user.entity';
import { IUserResponse } from '@src/resources/user/types/userResponse.Interface';
import { User } from '@src/common/decorators/user.decorator';
import { UserType } from '@src/resources/user/types/user.types';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<UserType> {
    return this.userService.create(createUserDto);
  }

  // todo not public
  @Get()
  async findAll(): Promise<UserEntity[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<UserEntity> {
    return this.userService.findById(id);
  }

  @Patch()
  async updateCurrentUser(
    @User('_id') currentUserId: string,
    @Body('user') updateUserDto: UpdateUserDto,
  ): Promise<IUserResponse> {
    const user = await this.userService.update(currentUserId, updateUserDto);
    return this.userService.buildUserResponse(user);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.userService.update(id, updateUserDto);
    return this.userService.buildUserResponse(user);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.userService.remove(id);
  }
}
