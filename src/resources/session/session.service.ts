import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { SessionEntity } from '@src/resources/session/session.entity';
import { CreateSessionDto } from '@src/resources/session/dto/createSession.dto';

@Injectable()
export class SessionService {
  constructor(
    @InjectModel(SessionEntity)
    private readonly sessionRepository: ModelType<SessionEntity>,
  ) {}

  async create(createSessionDto: CreateSessionDto): Promise<SessionEntity> {
    const newSession = new this.sessionRepository(createSessionDto);
    return await newSession.save();
  }

  async findByUserId(userId: string): Promise<SessionEntity> {
    return await this.sessionRepository.findOne({ userId }).exec();
  }

  async findByRefreshToken(refreshToken: string): Promise<SessionEntity> {
    return await this.sessionRepository.findOne({ refreshToken }).exec();
  }

  async update(updateSessionDto: CreateSessionDto): Promise<SessionEntity> {
    const session = await this.findByUserId(updateSessionDto.userId);
    const updated = await this.sessionRepository
      .findByIdAndUpdate(session._id, {
        refreshToken: updateSessionDto.refreshToken,
      })
      .exec();
    return updated;
  }

  async delete(userId: string) {
    return await this.sessionRepository.deleteOne({ userId }).exec();
  }
}
