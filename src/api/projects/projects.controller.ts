import { CacheInterceptor } from '@nestjs/cache-manager';
import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { QueryProjectDTO } from './dto/query-project.dto';
import { Project } from './schemas/project.schema';

@Controller('projects')
@UseInterceptors(CacheInterceptor)
export class ProjectsController {
  constructor(private projectsService: ProjectsService) { }

  @Get()
  async getProjects(@Query() query: QueryProjectDTO): Promise<Partial<Project>[]> {
    return this.projectsService.getAllProjects(query);
  }
}
