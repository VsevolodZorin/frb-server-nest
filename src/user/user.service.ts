import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from 'nestjs-typegoose';
import { UserEntity } from '@src/user/user.entity';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { RoleService } from '@src/role/role.service';
import { UserResponseInterface } from '@src/user/types/userResponse.Interface';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserEntity)
    private readonly userRepository: ModelType<UserEntity>,
    private readonly roleService: RoleService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const errorResponse = {
      errors: {},
    };

    const userByEmail = await this.userRepository.findOne({
      email: createUserDto.email,
    });

    if (userByEmail) {
      errorResponse.errors['email'] = 'has already been taken';
      throw new HttpException(errorResponse, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    let role = await this.roleService.findByName('member');
    if (!role) {
      role = await this.roleService.create({ name: 'member' });
    }

    const newUser = new this.userRepository();
    Object.assign(newUser, createUserDto, { role: role.name });

    return await newUser.save();
  }

  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  async findById(id: string): Promise<UserEntity> {
    return await this.userRepository.findById(id);
  }

  async findByEmail(email: string): Promise<UserEntity> {
    return await this.userRepository.findOne({ email });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    return await this.userRepository
      .findByIdAndUpdate(id, updateUserDto, {
        new: true,
      })
      .exec();
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  buildUserResponse(user: UserEntity): UserResponseInterface {
    return {
      user,
    };
  }
}
