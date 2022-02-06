import { Controller, Post } from '@nestjs/common';
import { AuthService } from '@src/auth/auth.service';
import { UserResponseInterface } from '@src/user/types/userResponse.Interface';
import { UserService } from '@src/user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('login')
  async login(): Promise<UserResponseInterface> {
    // todo
    const user = await this.authService.login('test');
    return this.userService.buildUserResponse(user);
  }
}
