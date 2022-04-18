import { PartialType } from '@nestjs/mapped-types';
import { CreateSkillDto } from './createSkill.dto';

export class UpdateSkillDto extends PartialType(CreateSkillDto) {}
