import { Request } from 'express';
import { UserEntity } from '@src/resources/user/user.entity';

export interface ExpressRequest extends Request {
  user?: UserEntity;
}
