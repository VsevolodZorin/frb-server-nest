import { prop } from '@typegoose/typegoose';
import { TimeStamps, Base } from '@typegoose/typegoose/lib/defaultClasses';

export interface UserEntity extends Base {}

export class UserEntity extends TimeStamps {
  @prop({ unique: true })
  email: string;

  @prop({ type: () => [String] })
  roles: string[];

  // @prop({ default: '' })
  // passwordHash: string;
}
