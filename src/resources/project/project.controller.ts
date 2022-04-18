import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  NotFoundException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/createProject.dto';
import { UpdateProjectDto } from './dto/updateProject.dto';
import { IProjectsResponse } from './types/projectsResponse.interface';
import { IProjectResponse } from './types/projectResponse.interface';
import { Role } from '@src/common/decorators/roles.decorator';
import { RolesEnum } from '../role/role.entity';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  async findAll(): Promise<IProjectsResponse> {
    const projects = await this.projectService.findAll();
    return this.projectService.buildProjectsResponse(projects);
  }

  @Get('/count')
  async count(): Promise<number> {
    return await this.projectService.count();
  }

  @Get('/pagination')
  async pagination(
    @Query('skip') skip: number,
    @Query('limit') limit: number,
  ): Promise<IProjectsResponse> {
    const projects = await this.projectService.pagination(skip, limit);
    if (!projects) {
      throw new NotFoundException('projects not found');
    }
    return this.projectService.buildProjectsResponse(projects);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<IProjectResponse> {
    const project = await this.projectService.findById(id);
    if (!project) {
      throw new NotFoundException('project not found');
    }
    return this.projectService.buildProjectResponse(project);
  }

  @Post()
  @Role(RolesEnum.ADMIN)
  @UsePipes(new ValidationPipe())
  async create(
    @Body() createProjectDto: CreateProjectDto,
  ): Promise<IProjectResponse> {
    const project = await this.projectService.create(createProjectDto);
    if (!project) {
      // todo make exeption
    }
    return this.projectService.buildProjectResponse(project);
  }

  @Patch(':id')
  @Role(RolesEnum.ADMIN)
  @UsePipes(new ValidationPipe())
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<IProjectResponse> {
    const updatedProject = await this.projectService.update(
      id,
      updateProjectDto,
    );
    if (!updatedProject) {
      throw new NotFoundException('project not found');
    }
    return this.projectService.buildProjectResponse(updatedProject);
  }

  @Delete(':id')
  @Role(RolesEnum.ADMIN)
  async remove(@Param('id') id: string) {
    const deletedProject = await this.projectService.remove(id);
    if (!deletedProject) {
      throw new NotFoundException('project not found');
    }
  }
}
