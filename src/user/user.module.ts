import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { UserEntity } from '@src/user/user.entity';

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: UserEntity,
        schemaOptions: {
          // db collection upperCase or lowerCase?
          collection: 'user',
        },
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
