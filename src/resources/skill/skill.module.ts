import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { SkillService } from './skill.service';
import { SkillController } from './skill.controller';
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
