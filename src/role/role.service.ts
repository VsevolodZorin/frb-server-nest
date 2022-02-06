import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { RoleEntity } from '@src/role/role.entity';
import { UserEntity } from '@src/user/user.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(RoleEntity)
    private readonly roleRepository: ModelType<RoleEntity>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<RoleEntity> {
    const errorResponse = {
      errors: {},
    };

    const roleByName = await this.roleRepository.findOne({
      name: createRoleDto.name,
    });
    if (roleByName) {
      errorResponse.errors['role'] = 'has already been taken';
      throw new HttpException(errorResponse, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    const newRole = new this.roleRepository(createRoleDto);
    return await newRole.save();
  }

  async findAll(): Promise<RoleEntity[]> {
    return await this.roleRepository.find();
  }

  // async findOne(id: string): Promise<RoleEntity> {
  //   return await this.roleRepository.findById(id);
  // }

  async findById(id: string): Promise<RoleEntity> {
    return await this.roleRepository.findById(id);
  }

  async findByName(name: string): Promise<RoleEntity> {
    return await this.roleRepository.findOne({ name });
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  async remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
