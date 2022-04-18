import { PartialType } from '@nestjs/mapped-types';
import { CreateArticleDto } from './createArticle.dto';

export class UpdateArticleDto extends PartialType(CreateArticleDto) {}
