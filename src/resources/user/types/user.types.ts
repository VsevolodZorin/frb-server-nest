import { UserEntity } from '@src/resources/user/user.entity';

export type UserType = Omit<UserEntity, 'passwordHash'>;
