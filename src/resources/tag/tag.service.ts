import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { CreateTagDto } from './dto/createTag.dto';
import { UpdateTagDto } from './dto/updateTag.dto';
import { TagEntity } from './tag.entity';
import { TagType } from './types/tag.type';
import { ITagResponse } from './types/tagResponse.interface';
import { ITagsResponse } from './types/tagsResponse.interface';

@Injectable()
export class TagService {
  constructor(
    @InjectModel(TagEntity)
    private readonly tagRepository: ModelType<TagEntity>,
  ) {}

  async findAll(): Promise<TagEntity[]> {
    return this.tagRepository.find().lean().exec();
  }

  async findById(id: string): Promise<TagEntity> {
    return this.tagRepository.findById(id).exec();
  }

  async count(): Promise<number> {
    return this.tagRepository.find().lean().countDocuments();
  }

  async pagination(skip: number, limit: number): Promise<TagEntity[]> {
    return this.tagRepository.find().lean().skip(skip).limit(limit).exec();
  }

  async create(createTagDto: CreateTagDto): Promise<TagEntity> {
    const tag = await this.tagRepository
      .findOne({ name: createTagDto.name })
      .lean()
      .exec();

    if (tag) {
      throw new UnprocessableEntityException(
        `Tag ${tag.name} has already been taken`,
      );
    }

    const newTag = new this.tagRepository(createTagDto);
    return newTag.save();
  }

  async update(id: string, updateTagDto: UpdateTagDto): Promise<TagEntity> {
    return this.tagRepository.findByIdAndUpdate(id, updateTagDto).exec();
  }

  async remove(id: string) {
    return this.tagRepository.findByIdAndRemove(id).exec();
  }

  convertTagEnityToTagType(tag: TagEntity): TagType {
    const { _id, name } = tag;
    return {
      id: _id.toString(),
      name,
    };
  }

  buildTagResponse(tag: TagEntity): ITagResponse {
    const convertedTag = this.convertTagEnityToTagType(tag);
    return {
      tag: convertedTag,
    };
  }

  buildTagsResponse(tags: TagEntity[]): ITagsResponse {
    const convertedTags = tags.map((el) => this.convertTagEnityToTagType(el));
    return {
      tags: convertedTags,
    };
  }
}
