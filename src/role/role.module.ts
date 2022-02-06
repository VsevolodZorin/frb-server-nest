import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { RoleEntity } from './role.entity';
import { RolesGuard } from '@src/common/guards/roles.guard';

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: RoleEntity,
        schemaOptions: {
          collection: 'roles',
        },
      },
    ]),
  ],
  controllers: [RoleController],
  providers: [RoleService, RolesGuard],
  exports: [RoleService],
})
export class RoleModule {}
