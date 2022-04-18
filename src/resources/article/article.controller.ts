import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UsePipes,
  ValidationPipe,
  NotFoundException,
} from '@nestjs/common';
import { Role } from '@src/common/decorators/roles.decorator';
import { RolesEnum } from '../role/role.entity';
import { ArticleEntity } from './article.entity';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/createArticle.dto';
import { UpdateArticleDto } from './dto/updateArticle.dto';
import { IArticleResponse } from './types/articleResponse.interface';
import { IArticlesResponse } from './types/articlesResponse.interface';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  async findAll(): Promise<IArticlesResponse> {
    const articles = await this.articleService.findAll();
    return this.articleService.buildArticlesResponse(articles);
  }

  @Get('/count')
  async count(): Promise<number> {
    return await this.articleService.count();
  }

  @Get('/pagination')
  async pagination(
    @Query('skip') skip: number,
    @Query('limit') limit: number,
  ): Promise<IArticlesResponse> {
    const articles = await this.articleService.pagination(skip, limit);
    return await this.articleService.buildArticlesResponse(articles);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<IArticleResponse> {
    const article = await this.articleService.findById(id);
    return await this.articleService.buildArticleResponse(article);
  }

  @Post()
  @Role(RolesEnum.ADMIN)
  @UsePipes(new ValidationPipe())
  async create(
    @Body() createArticleDto: CreateArticleDto,
  ): Promise<IArticleResponse> {
    const article = await this.articleService.create(createArticleDto);
    return await this.articleService.buildArticleResponse(article);
  }

  @Patch(':id')
  @Role(RolesEnum.ADMIN)
  @UsePipes(new ValidationPipe())
  async update(
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDto,
  ): Promise<IArticleResponse> {
    const updatedArticle = await this.articleService.update(
      id,
      updateArticleDto,
    );
    if (!updatedArticle) {
      throw new NotFoundException('article not found');
    }
    return await this.articleService.buildArticleResponse(updatedArticle);
  }

  @Delete(':id')
  @Role(RolesEnum.ADMIN)
  async remove(@Param('id') id: string) {
    const deletedArticle = await this.articleService.remove(id);
    if (!deletedArticle) {
      throw new NotFoundException('article not found');
    }
  }
}
