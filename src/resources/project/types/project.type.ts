import { ProjectEntity } from '../project.entity';

export interface ProjectType
  extends Omit<ProjectEntity, '_id' | '__v' | 'createdAt' | 'updatedAt'> {
  id: string;
  // name: string;
  // language: string;
  // status: string;
  // description: string;
  // technologies: string;
}
