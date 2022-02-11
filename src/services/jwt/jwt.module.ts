import { Module } from '@nestjs/common';
import { JwtService } from '@src/services/jwt/jwt.service';
import { ConfigModule } from '@nestjs/config';
import { TypegooseModule } from 'nestjs-typegoose';
import { JwtEntity } from '@src/services/jwt/jwt.entity';

@Module({
  imports: [
    ConfigModule,
    TypegooseModule.forFeature([
      {
        typegooseClass: JwtEntity,
        schemaOptions: {
          collection: 'jwt',
        },
      },
    ]),
  ],
  providers: [JwtService],
  exports: [JwtService],
})
export class JwtModule {}
