import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { PermissionEntity } from '@src/resources/permission/permission.entity';
import { UserModule } from '@src/resources/user/user.module';
import { RoleModule } from '@src/resources/role/role.module';

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: PermissionEntity,
        schemaOptions: {
          collection: 'permissions',
        },
      },
    ]),
    UserModule,
    RoleModule,
  ],
  controllers: [PermissionController],
  providers: [PermissionService],
})
export class PermissionModule {}
