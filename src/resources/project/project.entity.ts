import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

export interface ProjectEntity extends Base {}
export class ProjectEntity extends TimeStamps {
  @prop({ unique: true, required: true })
  name: string;

  @prop({ required: true })
  language: string;

  @prop({ required: true })
  status: string;

  @prop({ required: true })
  description: string;

  @prop({ required: true })
  technologies: string;
  // todo version / update
}
