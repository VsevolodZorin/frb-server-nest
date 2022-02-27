import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { UserService } from '@src/resources/user/user.service';
import { UserEntity } from '@src/resources/user/user.entity';
import { LoginUserDto } from '@src/resources/auth/dto/loginUser.dto';
import { IUserFindOptions } from '@src/resources/user/types/userFindOptons.interface';
import { compareSync } from 'bcryptjs';
import { JwtService } from '@src/services/jwt/jwt.service';
import { MailService } from '@src/services/mail/mail.service';
import { CreateUserDto } from '@src/resources/user/dto/create-user.dto';
import { v4 as uuid } from 'uuid';
import { IJwtTokenPair } from '@src/services/jwt/types/jwtTokenPair.interface';
import { EmailActivationService } from '../emailActivation/emailActivation.service';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly emailActivationService: EmailActivationService,
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

  async registration(
    dto: CreateUserDto,
  ): Promise<{ user: UserEntity } & { tokenPair: IJwtTokenPair }> {
    const user = await this.userService.create(dto);

    const activationLink = uuid(); // v34fa-asfasf-142saf-sa-asf
    const apiUrl = this.configService.get('API_URL');
    // todo activation link on client
    const link = `${apiUrl}/auth/activate/${activationLink}`;
    await this.mailService.sendActivationMail(dto.email, link);

    await this.emailActivationService.create({
      email: user.email,
      activationLink,
    });

    const tokenPair = await this.jwtService.generateTokenPair(user);

    return { user, tokenPair };
  }

  async activate(link: string) {
    const activationEntity =
      await this.emailActivationService.getByActivationLink(link);

    if (!activationEntity) {
      throw new BadRequestException('uncorrect activation link');
    }

    await this.userService.updateByEmail(activationEntity.email, {
      isActivated: true,
    });
    await this.emailActivationService.remove(link);
  }

  async login(loginUserDto: LoginUserDto): Promise<UserEntity> {
    // TODO
    // this.mailService.sendActivationMail('vsevolod.dev@gmail.com');

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
