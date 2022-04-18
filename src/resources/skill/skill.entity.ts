import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

export enum SkillTypeEnum {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
}

export interface SkillEntity extends Base {}
export class SkillEntity extends TimeStamps {
  @prop({ unique: true, required: true })
  name: string;

  @prop({ required: true, enum: SkillTypeEnum })
  type: SkillTypeEnum;

  @prop({ required: true })
  level: number;

  @prop({ required: true })
  img: string;

  @prop({ required: true })
  eventDate: string;

  @prop({ required: true })
  description: string;
}
