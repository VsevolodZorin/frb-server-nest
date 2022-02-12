import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from 'nestjs-typegoose';
import { UserEntity } from '@src/resources/user/user.entity';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { RoleService } from '@src/resources/role/role.service';
import { IUserResponse } from '@src/resources/user/types/userResponse.Interface';
import { RolesEnum } from '@src/common/types/role.enum';
import { IUserFindOptions } from '@src/resources/user/types/userFindOptons.interface';

import { genSalt, hash } from 'bcryptjs';

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

    const userByEmail = await this.userRepository
      .findOne({
        email: createUserDto.email,
      })
      .exec();

    if (userByEmail) {
      errorResponse.errors['email'] = 'has already been taken';
      throw new HttpException(errorResponse, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    let role = await this.roleService.findByName(RolesEnum.USER);
    if (!role) {
      role = await this.roleService.create({ name: RolesEnum.USER });
    }

    // TODO role name or id
    const newUser = new this.userRepository();

    const salt = await genSalt(10);
    const passwordHash = await hash(createUserDto.password, salt);

    Object.assign(
      newUser,
      createUserDto,
      { roles: [role.name] },
      { password: passwordHash },
    );

    const savedUser = await newUser.save();
    delete savedUser.password;
    return savedUser;
  }

  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find().exec();
  }

  async findById(
    id: string,
    findOptons: IUserFindOptions = {},
  ): Promise<UserEntity> {
    return await this.userRepository.findById(id, findOptons).exec();
  }

  async findByEmail(
    email: string,
    findOptons: IUserFindOptions = {},
  ): Promise<UserEntity> {
    return await this.userRepository.findOne({ email }, findOptons).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    return await this.userRepository
      .findByIdAndUpdate(id, updateUserDto, {
        new: true,
      })
      .exec();
  }

  async remove(id: string) {
    return await this.userRepository.findByIdAndDelete(id).exec();
  }

  buildUserResponse(user: UserEntity, accessToken?: string): IUserResponse {
    const { _id, id, email, firstName, lastName, roles } = user;
    return {
      user: {
        _id,
        id,
        email,
        firstName,
        lastName,
        roles,
      },
      accessToken,
    };
  }
}
