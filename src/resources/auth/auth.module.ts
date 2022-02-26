import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '@src/resources/user/user.module';
import { JwtModule } from '@src/services/jwt/jwt.module';
import { TelegramModule } from '@src/services/telegram/telegram.module';
import { MailModule } from '@src/services/mail/mail.module';

@Module({
  imports: [UserModule, JwtModule, TelegramModule, MailModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
