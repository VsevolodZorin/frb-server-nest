import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from '@src/auth/auth.module';
import { FirebaseMiddleware } from '@src/common/middleware/firebase.middleware';
import { FirebaseApp } from '@src/firebase/firebase-app';
import { TypegooseModule } from 'nestjs-typegoose';
import { getMongoConfig } from '@src/config/mongo.config';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypegooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getMongoConfig,
    }),
    AuthModule,
    UserModule,
  ],
  controllers: [],
  providers: [FirebaseApp],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(FirebaseMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
