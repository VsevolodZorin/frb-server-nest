import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  NotFoundException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SkillService } from './skill.service';
import { CreateSkillDto } from './dto/createSkill.dto';
import { UpdateSkillDto } from './dto/updateSkill.dto';
import { Role } from '@src/common/decorators/roles.decorator';
import { RolesEnum } from '@src/resources/role/role.entity';
import { ISkillsResponse } from './types/skillsResponse.interface';
import { ISkillResponse } from './types/skillResponse.interface';

@Controller('skills')
export class SkillController {
  constructor(private readonly skillService: SkillService) {}

  @Get()
  async findAll(): Promise<ISkillsResponse> {
    const skills = await this.skillService.findAll();
    return this.skillService.buildSkillsResponse(skills);
  }

  @Get('/count')
  async count(): Promise<number> {
    return await this.skillService.count();
  }

  @Get('/pagination')
  async pagination(
    @Query('skip') skip: number,
    @Query('limit') limit: number,
  ): Promise<ISkillsResponse> {
    const skills = await this.skillService.pagination(skip, limit);
    if (!skills) {
      throw new NotFoundException('skills not found');
    }
    return this.skillService.buildSkillsResponse(skills);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<ISkillResponse> {
    const skill = await this.skillService.findById(id);
    if (!skill) {
      throw new NotFoundException('skill not found');
    }
    return this.skillService.buildSkillResponse(skill);
  }

  @Post()
  @Role(RolesEnum.ADMIN)
  @UsePipes(new ValidationPipe())
  async create(
    @Body() createSkillDto: CreateSkillDto,
  ): Promise<ISkillResponse> {
    const skill = await this.skillService.create(createSkillDto);
    if (!skill) {
      // todo make exeption
    }
    return this.skillService.buildSkillResponse(skill);
  }

  @Patch(':id')
  @Role(RolesEnum.ADMIN)
  @UsePipes(new ValidationPipe())
  async update(
    @Param('id') id: string,
    @Body() updateSkillDto: UpdateSkillDto,
  ): Promise<ISkillResponse> {
    const updatedSkill = await this.skillService.update(id, updateSkillDto);
    if (!updatedSkill) {
      throw new NotFoundException('skill not found');
    }
    return this.skillService.buildSkillResponse(updatedSkill);
  }

  @Delete(':id')
  @Role(RolesEnum.ADMIN)
  async remove(@Param('id') id: string) {
    const deletedSkill = await this.skillService.remove(id);
    if (!deletedSkill) {
      throw new NotFoundException('skill not found');
    }
  }
}
