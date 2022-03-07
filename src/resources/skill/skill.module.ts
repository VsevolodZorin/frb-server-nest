import { Module } from '@nestjs/common';
import { SkillService } from './skill.service';
import { SkillController } from './skill.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { SkillEntity } from './skill.entity';

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: SkillEntity,
        schemaOptions: {
          collection: 'skills',
        },
      },
    ]),
  ],
  controllers: [SkillController],
  providers: [SkillService],
  exports: [SkillService],
})
export class SkillModule {}
