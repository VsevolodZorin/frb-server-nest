import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from 'nestjs-typegoose';
import { UserEntity } from '@src/user/user.entity';
import { ModelType } from '@typegoose/typegoose/lib/types';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserEntity) private readonly userEntity: ModelType<UserEntity>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const errorResponse = {
      errors: {},
    };

    const userByEmail = await this.userEntity.findOne({
      email: createUserDto.email,
    });
    if (userByEmail) {
      errorResponse.errors['email'] = 'has already been taken';
      throw new HttpException(errorResponse, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    const newUser = new this.userEntity();
    Object.assign(newUser, createUserDto);

    return await newUser.save();
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
