import { Injectable } from '@nestjs/common';
import { UserService } from '@src/resources/user/user.service';
import { UserEntity } from '@src/resources/user/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async loginWithFirebase(email: string): Promise<UserEntity> {
    // return 'login';
    let user = await this.userService.findByEmail(email);
    if (!user) {
      user = await this.userService.create({ email });
    }
    return user;
  }
}
