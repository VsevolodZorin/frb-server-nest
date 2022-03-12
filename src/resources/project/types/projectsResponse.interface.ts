import { ProjectType } from './project.type';

export interface IProjectsResponse {
  projects: ProjectType[];
  projectsCount?: number;
}
