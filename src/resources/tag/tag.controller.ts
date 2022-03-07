import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/createTag.dto';
import { UpdateTagDto } from './dto/updateTag.dto';
import { TagEntity } from './tag.entity';
import { Role } from '@src/common/decorators/roles.decorator';
import { RolesEnum } from '../role/role.entity';

@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  async findAll(): Promise<TagEntity[]> {
    return await this.tagService.findAll();
  }

  @Get('/count')
  async count(): Promise<number> {
    return await this.tagService.count();
  }

  @Get('/pagination')
  async pagination(
    @Query('skip') skip: number,
    @Query('limit') limit: number,
  ): Promise<TagEntity[]> {
    return await this.tagService.pagination(skip, limit);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<TagEntity> {
    return await this.tagService.findById(id);
  }

  @Post()
  @Role(RolesEnum.ADMIN)
  @UsePipes(new ValidationPipe())
  async create(@Body() createTagDto: CreateTagDto): Promise<TagEntity> {
    return await this.tagService.create(createTagDto);
  }

  @Patch(':id')
  @Role(RolesEnum.ADMIN)
  @UsePipes(new ValidationPipe())
  async update(
    @Param('id') id: string,
    @Body() updateTagDto: UpdateTagDto,
  ): Promise<TagEntity> {
    const updatedTag = await this.tagService.update(id, updateTagDto);
    if (!updatedTag) {
      throw new NotFoundException('tag not found');
    }
    return updatedTag;
  }

  @Delete(':id')
  @Role(RolesEnum.ADMIN)
  async remove(@Param('id') id: string) {
    const deletedTag = await this.tagService.remove(id);
    if (!deletedTag) {
      throw new NotFoundException('Tag not found');
    }
  }
}
