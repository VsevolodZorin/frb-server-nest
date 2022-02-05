import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

export interface RoleEntity extends Base {}

export class RoleEntity extends TimeStamps {
  // todo add string[]
  @prop({ unique: true, required: true })
  role: string;
}
