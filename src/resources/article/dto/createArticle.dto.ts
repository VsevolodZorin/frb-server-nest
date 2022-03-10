import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateArticleDto {
  @IsNotEmpty()
  editorData: string;

  @IsNotEmpty()
  bodyHtml: string;

  @IsNotEmpty()
  author: string;

  @IsNotEmpty()
  createdDate: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  imgPreview: string;

  @IsNotEmpty()
  language: string;

  @IsOptional()
  slug: string;

  @IsNotEmpty()
  title: string;

  @IsOptional()
  tagsIds?: string[];
}
