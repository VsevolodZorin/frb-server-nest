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
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';

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
  ],
  controllers: [],
  providers: [FirebaseApp],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(FirebaseMiddleware)
      .exclude({
        path: '*',
        method: RequestMethod.GET,
      })
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
  }
}
