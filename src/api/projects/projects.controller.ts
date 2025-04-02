import { CacheInterceptor } from '@nestjs/cache-manager';
import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { Project } from './interfaces/project.interface';

@Controller('projects')
@UseInterceptors(CacheInterceptor)
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Get()
  async findAll(): Promise<Project[]> {
    return this.projectsService.findAll();
  }
}
