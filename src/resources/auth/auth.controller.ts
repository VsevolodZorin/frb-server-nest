import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Redirect,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from '@src/resources/auth/auth.service';
import { IUserResponse } from '@src/resources/user/types/userResponse.Interface';
import { UserService } from '@src/resources/user/user.service';
import { LoginUserDto } from '@src/resources/auth/dto/loginUser.dto';
import { CreateUserDto } from '@src/resources/user/dto/create-user.dto';
import { Request, Response } from 'express';
import { JwtService } from '@src/services/jwt/jwt.service';
import { User } from '@src/common/decorators/user.decorator';
import { TelegramService } from '@src/services/telegram/telegram.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly telegramService: TelegramService,
  ) {}

  // @Post('loginWithFirebase')
  // async loginWithFirebase(
  //   @User('email') email: string,
  // ): Promise<IUserResponse> {
  //   const user = await this.authService.loginWithFirebase(email);
  //   return this.userService.buildUserResponse(user);
  // }

  @Get('/test')
  async test() {
    return 'auth rest';
    // return this.authService.test();
  }

  @Post('/registration')
  async registration(
    @Res() response: Response,
    @Body() createUserDto: CreateUserDto,
  ) {
    const { user, tokenPair } = await this.authService.registration(
      createUserDto,
    );
    response.cookie('refreshToken', tokenPair.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    const userResponse = await this.userService.buildUserResponse(
      user,
      tokenPair.accessToken,
    );
    response.json(userResponse);
  }

  // todo change redirect
  @Get('/activate/:link')
  @Redirect('http://localhost:3000', 302)
  async activate(@Param('link') link: string) {
    await this.authService.activate(link);
  }

  @Post('/login')
  async login(@Body() loginUserDto: LoginUserDto, @Res() response: Response) {
    await this.telegramService.sendMessage(
      `login -> email: ${loginUserDto.email}`,
    );
    const user = await this.authService.login(loginUserDto);
    const tokenPair = await this.jwtService.generateTokenPair(user);
    response.cookie('refreshToken', tokenPair.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    const userResponse = this.userService.buildUserResponse(
      user,
      tokenPair.accessToken,
    );

    response.json(userResponse);
  }

  async logout() {
    return;
  }

  @Post('/refresh')
  async refresh(
    @User('id') userId: string,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    console.log('/refresh userId', userId);
    const { refreshToken } = request.cookies;
    const tokenPair = this.authService.refresh(refreshToken);
    // response.cookie('refreshToken', tokenPain.refreshToken);
    // const userResponse = this.userService.buildUserResponse(
    //   user,
    //   tokenPain.accessToken,
    // );

    response.json({ msg: 'refresh' });
    return;
  }
}
