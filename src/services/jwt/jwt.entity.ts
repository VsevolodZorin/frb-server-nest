import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { prop } from '@typegoose/typegoose';

export interface JwtEntity extends Base {}

export class JwtEntity extends TimeStamps {
  @prop({ required: true, unique: true })
  userId: string;

  @prop({ required: true })
  refreshToken: string;
}
