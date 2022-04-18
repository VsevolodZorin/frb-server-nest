import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { CreateProjectDto } from './dto/createProject.dto';
import { UpdateProjectDto } from './dto/updateProject.dto';
import { ProjectEntity } from './project.entity';
import { ProjectType } from './types/project.type';
import { IProjectResponse } from './types/projectResponse.interface';
import { IProjectsResponse } from './types/projectsResponse.interface';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(ProjectEntity)
    private readonly projectRepository: ModelType<ProjectEntity>,
  ) {}
  async findAll(): Promise<ProjectEntity[]> {
    return this.projectRepository.find().lean().exec();
  }

  async findById(id: string): Promise<ProjectEntity> {
    return this.projectRepository.findById(id).exec();
  }

  async count(): Promise<number> {
    return this.projectRepository.find().lean().countDocuments();
  }

  async pagination(skip: number, limit: number): Promise<ProjectEntity[]> {
    return this.projectRepository.find().lean().skip(skip).limit(limit).exec();
  }

  async create(createProjectDto: CreateProjectDto): Promise<ProjectEntity> {
    const project = await this.projectRepository
      .findOne({ name: createProjectDto.name })
      .lean()
      .exec();

    if (project) {
      throw new UnprocessableEntityException(
        `Project ${project.name} has already been taken`,
      );
    }

    const newProject = new this.projectRepository(createProjectDto);
    return newProject.save();
  }

  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
  ): Promise<ProjectEntity> {
    return this.projectRepository
      .findByIdAndUpdate(id, updateProjectDto)
      .exec();
  }

  async remove(id: string) {
    return this.projectRepository.findByIdAndRemove(id).exec();
  }

  convertProjectEnityToProjectType(project: ProjectEntity): ProjectType {
    const { _id, name, language, status, description, technologies } = project;
    return {
      id: _id.toString(),
      name,
      language,
      status,
      description,
      technologies,
    };
  }

  buildProjectResponse(project: ProjectEntity): IProjectResponse {
    const convertedProject = this.convertProjectEnityToProjectType(project);
    return {
      project: convertedProject,
    };
  }

  buildProjectsResponse(projects: ProjectEntity[]): IProjectsResponse {
    const convertedProjects = projects.map((el) =>
      this.convertProjectEnityToProjectType(el),
    );
    return {
      projects: convertedProjects,
    };
  }
}
