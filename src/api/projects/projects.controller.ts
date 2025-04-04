import { CacheInterceptor } from '@nestjs/cache-manager';
import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { ProjectsService } from './projects.service';

@Controller('projects')
@UseInterceptors(CacheInterceptor)
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Get()
  async getProjects() {
    return this.projectsService.getAllProjects();
  }
}
