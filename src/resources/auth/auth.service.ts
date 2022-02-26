import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '@src/resources/user/user.service';
import { UserEntity } from '@src/resources/user/user.entity';
import { LoginUserDto } from '@src/resources/auth/dto/loginUser.dto';
import { IUserFindOptions } from '@src/resources/user/types/userFindOptons.interface';
import { compareSync } from 'bcryptjs';
import { JwtService } from '@src/services/jwt/jwt.service';
import { MailService } from '@src/services/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  // async loginWithFirebase(email: string): Promise<UserEntity> {
  // return 'login';
  // const user = await this.userService.findByEmail(email);
  // if (!user) {
  //   user = await this.userService.create({ email });
  // }
  // return user;
  // }

  async login(loginUserDto: LoginUserDto): Promise<UserEntity> {
    // TODO
    this.mailService.sendUserConfirmation('vsevolod.dev@gmail.com');

    const errorResponse = {
      errors: {
        'email or password': 'is invalid',
      },
    };
    // TODO сделать нормальный интерфейс IUserFindOptions из объекта
    const userFindOptions: IUserFindOptions = {
      __v: 0,
      createdAt: 0,
      updatedAt: 0,
    };
    const user = await this.userService.findByEmail(
      loginUserDto.email,
      userFindOptions,
    );
    if (!user) {
      //     FORBIDDEN = 403,
      throw new HttpException(errorResponse, HttpStatus.UNPROCESSABLE_ENTITY);
    }
    const isPasswordCorrect = compareSync(loginUserDto.password, user.password);
    if (!isPasswordCorrect) {
      //     FORBIDDEN = 403,
      throw new HttpException(errorResponse, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    return user;
  }

  async logout() {
    return;
  }

  async activate() {
    return;
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'unauthorized',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    const jwtPayload = await this.jwtService.validateRefreshToken(refreshToken);
    console.log('---refresh jwtPayload', jwtPayload);
  }
}
