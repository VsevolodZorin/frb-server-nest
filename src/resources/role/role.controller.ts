import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/createRole.dto';
import { UpdateRoleDto } from './dto/updateRole.dto';
import { RoleEntity, RolesEnum } from '@src/resources/role/role.entity';
import { Role } from '@src/common/decorators/roles.decorator';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @Role(RolesEnum.ADMIN)
  async create(@Body() createRoleDto: CreateRoleDto): Promise<RoleEntity> {
    return this.roleService.create(createRoleDto);
  }

  @Get()
  async findAll(): Promise<RoleEntity[]> {
    return this.roleService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.roleService.findById(id);
  }

  @Patch(':id')
  @Role(RolesEnum.ADMIN)
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  @Role(RolesEnum.ADMIN)
  remove(@Param('id') id: string) {
    return this.roleService.remove(+id);
  }
}
