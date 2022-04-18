import { Module } from '@nestjs/common';
import { JwtService } from '@src/services/jwt/jwt.service';
import { ConfigModule } from '@nestjs/config';
import { SessionModule } from '@src/resources/session/sessoin.module';

@Module({
  imports: [ConfigModule, SessionModule],
  providers: [JwtService],
  exports: [JwtService],
})
export class JwtModule {}
