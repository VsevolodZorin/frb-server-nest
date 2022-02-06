import { Injectable } from '@nestjs/common';
import { UserService } from '@src/user/user.service';
import { UserEntity } from '@src/user/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async login(email: string): Promise<UserEntity> {
    // return 'login';
    let user = await this.userService.findByEmail(email);
    if (!user) {
      user = await this.userService.create({ email });
    }
    return user;
  }
}
