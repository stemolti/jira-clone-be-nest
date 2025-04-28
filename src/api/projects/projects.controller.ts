import { CacheInterceptor } from '@nestjs/cache-manager';
import { Controller, Get, Param, Query, UseInterceptors } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { QueryProjectDTO } from './dto/query-project.dto';

@Controller('projects')
@UseInterceptors(CacheInterceptor)
export class ProjectsController {
  constructor(private projectsService: ProjectsService) { }

  @Get()
  async getProjects(@Query() query: QueryProjectDTO) {
    console.log(typeof query.startAt);
    console.log(typeof query.maxResults);
    return this.projectsService.getAllProjects(query);
  }
}
