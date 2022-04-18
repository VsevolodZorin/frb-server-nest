import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import slugify from 'slugify';
import { TagService } from '../tag/tag.service';
import { ArticleEntity } from './article.entity';
import { CreateArticleDto } from './dto/createArticle.dto';
import { UpdateArticleDto } from './dto/updateArticle.dto';
import { ArticleType } from './types/article.type';
import { IArticleResponse } from './types/articleResponse.interface';
import { IArticlesResponse } from './types/articlesResponse.interface';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(ArticleEntity)
    private readonly articleRepository: ModelType<ArticleEntity>,
    private readonly tagService: TagService,
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
      .findOne({ title: createArticleDto.title })
      .lean()
      .exec();

    if (article) {
      throw new UnprocessableEntityException(
        `Article ${article.slug} has already been taken`,
      );
    }

    const newArticle = new this.articleRepository(createArticleDto);
    newArticle.slug = this.getSlug(createArticleDto.title);

    return newArticle.save();
  }

  async update(
    id: string,
    updateArticleDto: UpdateArticleDto,
  ): Promise<ArticleEntity> {
    if (updateArticleDto.title) {
      updateArticleDto.slug = this.getSlug(updateArticleDto.title);
    }
    return this.articleRepository
      .findByIdAndUpdate(id, updateArticleDto)
      .exec();
  }

  async remove(id: string) {
    return this.articleRepository.findByIdAndRemove(id).exec();
  }

  private getSlug(title: string): string {
    // return (
    //   slugify(title, { lower: true }) +
    //   '-' +
    //   ((Math.random() * Math.pow(36, 6)) | 0).toString(36)
    // );
    return slugify(title, { lower: true });
  }

  async convertArticleEnityToArticleType(
    article: ArticleEntity,
  ): Promise<ArticleType> {
    const {
      _id,
      editorData,
      bodyHtml,
      author,
      createdDate,
      description,
      imgPreview,
      language,
      slug,
      title,
      tagsIds,
    } = article;
    const tagEntities = await this.tagService.findByIds(tagsIds);
    const { tags } = this.tagService.buildTagsResponse(tagEntities);

    return {
      id: _id.toString(),
      editorData,
      bodyHtml,
      author,
      createdDate,
      description,
      imgPreview,
      language,
      slug,
      title,
      tags,
    };
  }

  async buildArticleResponse(
    article: ArticleEntity,
  ): Promise<IArticleResponse> {
    const convertedArticle = await this.convertArticleEnityToArticleType(
      article,
    );
    return {
      article: convertedArticle,
    };
  }

  async buildArticlesResponse(
    articles: ArticleEntity[],
  ): Promise<IArticlesResponse> {
    const convertedArticlesPromise = Promise.all(
      articles.map((el) => this.convertArticleEnityToArticleType(el)),
    );
    const convertedArticles = await convertedArticlesPromise;
    return {
      articles: convertedArticles,
    };
  }
}
