import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { ArticleEntity } from './article.entity';
import { CreateArticleDto } from './dto/createArticle.dto';
import { UpdateArticleDto } from './dto/updateArticle.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(ArticleEntity)
    private readonly articleRepository: ModelType<ArticleEntity>,
  ) {}

  async findAll(): Promise<ArticleEntity[]> {
    return this.articleRepository.find().lean().exec();
  }

  async findById(id: string): Promise<ArticleEntity> {
    return this.articleRepository.findById(id).exec();
  }

  async count(): Promise<number> {
    return this.articleRepository.find().lean().countDocuments();
  }

  async pagination(skip: number, limit: number): Promise<ArticleEntity[]> {
    return this.articleRepository.find().lean().skip(skip).limit(limit).exec();
  }

  async create(createArticleDto: CreateArticleDto): Promise<ArticleEntity> {
    const article = await this.articleRepository
      .findOne({ slug: createArticleDto.slug })
      .lean()
      .exec();

    if (article) {
      throw new UnprocessableEntityException(
        `Article ${article.slug} has already been taken`,
      );
    }

    const newArticle = new this.articleRepository(createArticleDto);
    return newArticle.save();
  }

  async update(
    id: string,
    updateArticleDto: UpdateArticleDto,
  ): Promise<ArticleEntity> {
    return this.articleRepository
      .findByIdAndUpdate(id, updateArticleDto)
      .exec();
  }

  async remove(id: string) {
    return this.articleRepository.findByIdAndRemove(id).exec();
  }
}
