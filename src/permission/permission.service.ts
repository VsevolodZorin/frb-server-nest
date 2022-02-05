import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { PermissionEntity } from '@src/permission/permission.entity';
import { UserService } from '@src/user/user.service';
import { RoleService } from '@src/role/role.service';
import { RoleEntity } from '@src/role/role.entity';
import { UserEntity } from '@src/user/user.entity';

type PromiseAllType = [
  Promise<UserEntity>,
  Promise<RoleEntity>,
  Promise<PermissionEntity>,
];

@Injectable()
export class PermissionService {
  constructor(
    @InjectModel(PermissionEntity)
    private readonly permissionRepository: ModelType<PermissionEntity>,
    private readonly userService: UserService,
    private readonly roleService: RoleService,
  ) {}

  async create(
    createPermissionDto: CreatePermissionDto,
  ): Promise<PermissionEntity> {
    const errorResponse = {
      errors: {},
    };
    const res = await Promise.all([
      this.userService.findOne(createPermissionDto.userId),
      this.roleService.findOne(createPermissionDto.roleId),
      this.findByUserId(createPermissionDto.userId),
    ] as PromiseAllType);
    console.log('--- PermissionService create res', res);
    // todo check
    if (!res[0]) {
      console.log('--- !res[0]', res[0]);
      errorResponse.errors['user'] = 'not found';
    }

    if (!res[1]) {
      console.log('--- !res[1]', res[1]);
      errorResponse.errors['role'] = 'not found';
    }

    if (res[2]) {
      console.log('--- res[2]', res[2]);
      errorResponse.errors['permission'] = 'user already have permission';
    }

    if (!res[0] || !res[1] || res[2]) {
      throw new HttpException(errorResponse, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    const newPermission = new this.permissionRepository(createPermissionDto);
    return await newPermission.save();
  }

  async findAll(): Promise<PermissionEntity[]> {
    return await this.permissionRepository.find();
  }

  async findOne(id: string): Promise<PermissionEntity> {
    return await this.permissionRepository.findById(id);
  }

  async findByUserId(userId: string): Promise<PermissionEntity> {
    return await this.permissionRepository.findOne({ userId });
  }

  update(id: number, updatePermissionDto: UpdatePermissionDto) {
    return `This action updates a #${id} permission`;
  }

  remove(id: number) {
    return `This action removes a #${id} permission`;
  }
}
