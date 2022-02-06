import { Controller, Post } from '@nestjs/common';
import { AuthService } from '@src/auth/auth.service';
import { UserResponseInterface } from '@src/user/types/userResponse.Interface';
import { UserService } from '@src/user/user.service';
import { User } from '@src/common/decorators/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('login')
  async login(@User('email') email: string): Promise<UserResponseInterface> {
    const user = await this.authService.login(email);
    return this.userService.buildUserResponse(user);
  }
}
