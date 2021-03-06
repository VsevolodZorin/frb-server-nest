import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { UserEntity } from '@src/resources/user/user.entity';
import { RoleModule } from '@src/resources/role/role.module';
import { JwtModule } from '@src/services/jwt/jwt.module';

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: UserEntity,
        schemaOptions: {
          collection: 'users',
        },
      },
    ]),
    RoleModule,
    JwtModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
