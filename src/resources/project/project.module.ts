import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { ProjectEntity } from './project.entity';

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: ProjectEntity,
        schemaOptions: {
          collection: 'projects',
        },
      },
    ]),
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
