import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IJwtPayload } from '@src/services/jwt/types/jwtPayload.interface';
import * as jwt from 'jsonwebtoken';
import { IJwtTokenPair } from '@src/services/jwt/types/jwtTokenPair.interface';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { JwtEntity } from './jwt.entity';
import { UserEntity } from '@src/resources/user/user.entity';
import { UserType } from '@src/resources/user/types/user.types';

@Injectable()
export class JwtService {
  constructor(
    @InjectModel(JwtEntity)
    private readonly jwtRepository: ModelType<JwtEntity>,
    private readonly configService: ConfigService,
  ) {}

  generateTokenPair(user: UserType): IJwtTokenPair {
    const payload: IJwtPayload = {
      _id: user._id.toString(),
      email: user.email,
    };
    const accessToken = jwt.sign(
      payload,
      this.configService.get('JWT_ACCESS_SECRET'),
      { expiresIn: this.configService.get('JWT_ACCESS_EXPIRESIN') },
    );
    const refreshToken = jwt.sign(
      payload,
      this.configService.get('JWT_REFRESH_SECRET'),
      { expiresIn: this.configService.get('JWT_REFRESH_EXPIRESIN') },
    );
    return {
      accessToken,
      refreshToken,
    };
  }

  validateAccessToken(token: string): IJwtPayload {
    try {
      const userData = jwt.verify(
        token,
        this.configService.get('JWT_ACCESS_SECRET'),
      );
      return userData as IJwtPayload;
    } catch (err) {
      console.log('--- catch validateAccessToken', err.message);
      return null;
    }
  }

  validateRefreshToken(token) {
    try {
      const userData = jwt.verify(
        token,
        this.configService.get('JWT_REFRESH_SECRET'),
      );
      return userData;
    } catch (err) {
      console.log('--- catch validateRefreshToken', err.message);
      return null;
    }
  }

  // todo check
  async saveToken(userId, refreshToken): Promise<JwtEntity> {
    const savedToken = await this.jwtRepository
      .findOneAndUpdate({ userId }, refreshToken, { new: true })
      .exec();
    return savedToken;
  }

  // todo refactor return await
  async removeToken(refreshToken) {
    const tokenData = await this.jwtRepository.deleteOne({ refreshToken });
    console.log('--- remove token tokenData', tokenData);
    return tokenData;
  }

  async findToken(refreshToken): Promise<JwtEntity> {
    return await this.jwtRepository.findOne({ refreshToken });
  }
}
