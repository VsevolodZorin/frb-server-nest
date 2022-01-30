import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from '@src/app.controller';
import { AppService } from '@src/app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@src/auth/auth.module';
import { AuthFrbMiddleware } from '@src/auth/middlewares/authFrb.middleware';
import { UserModule } from './user/user.module';
import { FirebaseApp } from '@src/firebase/firebase-app';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, UserModule],
  controllers: [AppController],
  providers: [FirebaseApp, AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthFrbMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
