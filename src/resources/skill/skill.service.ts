import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateSkillDto } from './dto/createSkill.dto';
import { UpdateSkillDto } from './dto/updateSkill.dto';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { SkillEntity } from '@src/resources/skill/skill.entity';

@Injectable()
export class SkillService {
  constructor(
    @InjectModel(SkillEntity)
    private readonly skillRepository: ModelType<SkillEntity>,
  ) {}

  async findAll(): Promise<SkillEntity[]> {
    return this.skillRepository.find().lean().exec();
  }

  async findById(id: string): Promise<SkillEntity> {
    return this.skillRepository.findById(id).exec();
  }

  async count(): Promise<number> {
    return this.skillRepository.find().lean().countDocuments();
  }

  async pagination(skip: number, limit: number): Promise<SkillEntity[]> {
    return this.skillRepository.find().lean().skip(skip).limit(limit).exec();
  }

  async create(createSkillDto: CreateSkillDto): Promise<SkillEntity> {
    const skill = await this.skillRepository
      .findOne({ name: createSkillDto.name })
      .lean()
      .exec();

    if (skill) {
      throw new UnprocessableEntityException(
        `Skill ${skill.name} has already been taken`,
      );
    }

    const newSkill = new this.skillRepository(createSkillDto);
    return newSkill.save();
  }

  async update(
    id: string,
    updateSkillDto: UpdateSkillDto,
  ): Promise<SkillEntity> {
    return this.skillRepository.findByIdAndUpdate(id, updateSkillDto).exec();
  }

  async remove(id: string) {
    return this.skillRepository.findByIdAndRemove(id).exec();
  }
}
