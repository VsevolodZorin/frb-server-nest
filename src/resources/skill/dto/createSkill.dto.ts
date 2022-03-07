import { IsNotEmpty } from 'class-validator';
import { SkillTypeEnum } from '../skill.entity';

export class CreateSkillDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  type: SkillTypeEnum;

  @IsNotEmpty()
  level: number;

  @IsNotEmpty()
  img: string;

  @IsNotEmpty()
  eventDate: string;

  @IsNotEmpty()
  description: string;
}
