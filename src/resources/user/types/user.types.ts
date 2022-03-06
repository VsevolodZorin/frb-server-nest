import { UserEntity } from '@src/resources/user/user.entity';

// export type UserType = Omit<UserEntity, 'password'>;

// todo role type admin | user
export type UserType = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  isActivated: boolean;
};
