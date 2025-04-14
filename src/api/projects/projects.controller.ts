import { CacheInterceptor } from '@nestjs/cache-manager';
import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { QueryProjectDTO } from './dto/query-project.dto';

@Controller('projects')
@UseInterceptors(CacheInterceptor)
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Get()
  async getProjects(@Query() query: QueryProjectDTO) {
    return this.projectsService.getAllProjects(query);
  }
}
