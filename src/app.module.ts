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
import { MailModule } from '@src/services/mail/mail.module';
import { EmailActivationModule } from '@src/resources/emailActivation/emailActivation.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { SkillModule } from './resources/skill/skill.module';
import { TagModule } from './resources/tag/tag.module';
import { ArticleModule } from './resources/article/article.module';
import { ProjectModule } from './resources/project/project.module';

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
    SkillModule,
    EmailActivationModule,
    TelegramModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getTelegramConfig,
    }),
    SessionModule,
    JwtModule,
    MailModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'assets'),
      // exclude: ['/api*'],
      exclude: ['/*'],
      // serveStaticOptions: {
      //   redirect: false,
      //   index: false,
      // },
    }),
    TagModule,
    ArticleModule,
    ProjectModule,
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
    consumer
      .apply(FirebaseMiddleware)
      .exclude({
        path: '*',
        method: RequestMethod.GET,
      })
      .forRoutes(
        {
          path: 'auth/loginfrb',
          method: RequestMethod.GET,
        },
        // {
        //   path: '*',
        //   method: RequestMethod.POST,
        // },
        // {
        //   path: '*',
        //   method: RequestMethod.PATCH,
        // },
        // {
        //   path: '*',
        //   method: RequestMethod.DELETE,
        // },
      );
  }
}
