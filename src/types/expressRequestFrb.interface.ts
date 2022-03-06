import { UserEntity } from '@src/resources/user/user.entity';
import { Request } from 'express';

export interface ExpressRequestFrb extends Request {
  user: UserEntity;
}
