import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { ArticleEntity } from './article.entity';

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: ArticleEntity,
        schemaOptions: {
          collection: 'articles',
        },
      },
    ]),
  ],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}
