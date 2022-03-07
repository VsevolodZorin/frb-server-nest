import { PartialType } from '@nestjs/mapped-types';
import { CreateTagDto } from './createTag.dto';

export class UpdateTagDto extends PartialType(CreateTagDto) {}
