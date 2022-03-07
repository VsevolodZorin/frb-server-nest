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
import { SkillEntity } from './skill.entity';
import { Role } from '@src/common/decorators/roles.decorator';
import { RolesEnum } from '@src/resources/role/role.entity';

@Controller('skills')
export class SkillController {
  constructor(private readonly skillService: SkillService) {}

  @Get()
  async findAll(): Promise<SkillEntity[]> {
    return await this.skillService.findAll();
  }

  @Get('/count')
  async count(): Promise<number> {
    return await this.skillService.count();
  }

  @Get('/pagination')
  async pagination(
    @Query('skip') skip: number,
    @Query('limit') limit: number,
  ): Promise<SkillEntity[]> {
    return await this.skillService.pagination(skip, limit);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<SkillEntity> {
    return await this.skillService.findById(id);
  }

  @Post()
  @Role(RolesEnum.ADMIN)
  @UsePipes(new ValidationPipe())
  async create(@Body() createSkillDto: CreateSkillDto): Promise<SkillEntity> {
    return await this.skillService.create(createSkillDto);
  }

  @Patch(':id')
  @Role(RolesEnum.ADMIN)
  @UsePipes(new ValidationPipe())
  async update(
    @Param('id') id: string,
    @Body() updateSkillDto: UpdateSkillDto,
  ): Promise<SkillEntity> {
    const updatedSkill = await this.skillService.update(id, updateSkillDto);
    if (!updatedSkill) {
      throw new NotFoundException('skill not found');
    }
    return updatedSkill;
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
