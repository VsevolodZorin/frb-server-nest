import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { AuthService } from '@src/resources/auth/auth.service';
import { IUserResponse } from '@src/resources/user/types/userResponse.Interface';
import { UserService } from '@src/resources/user/user.service';
import { LoginUserDto } from '@src/resources/auth/dto/loginUser.dto';
import { CreateUserDto } from '@src/resources/user/dto/create-user.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  // @Post('loginWithFirebase')
  // async loginWithFirebase(
  //   @User('email') email: string,
  // ): Promise<IUserResponse> {
  //   const user = await this.authService.loginWithFirebase(email);
  //   return this.userService.buildUserResponse(user);
  // }

  @Post('/registration')
  async registration(
    @Res() response: Response,
    @Body('user') createUserDto: CreateUserDto,
  ): Promise<IUserResponse> {
    const user = await this.userService.create(createUserDto);
    // response.cookie('refreshToken', '');
    const regResp = this.userService.buildUserResponse(user);
    console.log('regResp', regResp);
    return this.userService.buildUserResponse(user);
  }

  @Post('/login')
  async login(
    @Res() response: Response,
    @Body('user') loginUserDto: LoginUserDto,
  ): Promise<IUserResponse> {
    const user = await this.authService.login(loginUserDto);
    return this.userService.buildUserResponse(user);
  }

  async logout() {
    return;
  }

  async activate() {
    return;
  }

  async refresh() {
    return;
  }
}
