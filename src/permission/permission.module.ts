import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { PermissionEntity } from '@src/permission/permission.entity';
import { UserModule } from '@src/user/user.module';
import { RoleModule } from '@src/role/role.module';

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
