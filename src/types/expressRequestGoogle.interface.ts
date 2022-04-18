import { UserEntity } from '@src/resources/user/user.entity';
import { Request } from 'express';

export interface ExpressRequestGoogle extends Request {
  user: Partial<UserEntity>;
}
