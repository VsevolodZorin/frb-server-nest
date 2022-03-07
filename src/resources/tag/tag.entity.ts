import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

export interface TagEntity extends Base {}
export class TagEntity extends TimeStamps {
  @prop({ unique: true, required: true })
  name: string;
}
