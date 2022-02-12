import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from '@src/resources/auth/auth.module';
import { FirebaseMiddleware } from '@src/common/middleware/firebase.middleware';
import { FirebaseApp } from '@src/services/firebase/firebase-app';
import { TypegooseModule } from 'nestjs-typegoose';
import { getMongoConfig } from '@src/config/mongo.config';
import { UserModule } from './resources/user/user.module';
import { RoleModule } from './resources/role/role.module';
import { PermissionModule } from './resources/permission/permission.module';
import { TelegramModule } from './services/telegram/telegram.module';
import { getTelegramConfig } from '@src/config/telegram.config';
import { AuthMiddleware } from '@src/common/middleware/auth.middleware';
import { JwtModule } from '@src/services/jwt/jwt.module';
import { SessionModule } from '@src/resources/session/sessoin.module';

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
    RoleModule,
    PermissionModule,
    TelegramModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getTelegramConfig,
    }),
    SessionModule,
    JwtModule,
  ],
  controllers: [],
  providers: [FirebaseApp],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: '/auth/registration', method: RequestMethod.POST },
        { path: '/auth/login', method: RequestMethod.POST },
        // { path: '/auth/refresh', method: RequestMethod.POST },
      )
      .forRoutes(
        {
          path: '*',
          method: RequestMethod.POST,
        },
        {
          path: '*',
          method: RequestMethod.PATCH,
        },
        {
          path: '*',
          method: RequestMethod.DELETE,
        },
      );
    // consumer
    //   .apply(FirebaseMiddleware)
    //   .exclude({
    //     path: '*',
    //     method: RequestMethod.GET,
    //   })
    //   .forRoutes(
    //     {
    //       path: '*',
    //       method: RequestMethod.POST,
    //     },
    //     {
    //       path: '*',
    //       method: RequestMethod.PATCH,
    //     },
    //     {
    //       path: '*',
    //       method: RequestMethod.DELETE,
    //     },
    //   );
  }
}
