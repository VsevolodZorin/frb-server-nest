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
import { Role } from '@src/common/decorators/roles.decorator';
import { RolesEnum } from '../role/role.entity';
import { ITagsResponse } from './types/tagsResponse.interface';
import { ITagResponse } from './types/tagResponse.interface';

@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  async findAll(): Promise<ITagsResponse> {
    const tags = await this.tagService.findAll();
    return this.tagService.buildTagsResponse(tags);
  }

  @Get('/count')
  async count(): Promise<number> {
    return await this.tagService.count();
  }

  @Get('/pagination')
  async pagination(
    @Query('skip') skip: number,
    @Query('limit') limit: number,
  ): Promise<ITagsResponse> {
    const tags = await this.tagService.pagination(skip, limit);
    return this.tagService.buildTagsResponse(tags);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<ITagResponse> {
    const tag = await this.tagService.findById(id);
    return this.tagService.buildTagResponse(tag);
  }

  @Post()
  @Role(RolesEnum.ADMIN)
  @UsePipes(new ValidationPipe())
  async create(@Body() createTagDto: CreateTagDto): Promise<ITagResponse> {
    const tag = await this.tagService.create(createTagDto);
    return this.tagService.buildTagResponse(tag);
  }

  @Patch(':id')
  @Role(RolesEnum.ADMIN)
  @UsePipes(new ValidationPipe())
  async update(
    @Param('id') id: string,
    @Body() updateTagDto: UpdateTagDto,
  ): Promise<ITagResponse> {
    const updatedTag = await this.tagService.update(id, updateTagDto);
    if (!updatedTag) {
      throw new NotFoundException('tag not found');
    }
    return this.tagService.buildTagResponse(updatedTag);
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
