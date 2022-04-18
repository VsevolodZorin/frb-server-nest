import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { TagEntity } from './tag.entity';

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: TagEntity,
        schemaOptions: {
          collection: 'tags',
        },
      },
    ]),
  ],
  controllers: [TagController],
  providers: [TagService],
  exports: [TagService],
})
export class TagModule {}
