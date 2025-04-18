import { CacheInterceptor } from '@nestjs/cache-manager';
import { Controller, Get, Param, Query, UseInterceptors } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { QueryProjectDTO } from './dto/query-project.dto';
import { QueryIssueDTO } from '@api/issues/dto/query-issue.dto';

@Controller('projects')
@UseInterceptors(CacheInterceptor)
export class ProjectsController {
  constructor(private projectsService: ProjectsService) { }

  @Get()
  async getProjects(@Query() query: QueryProjectDTO) {
    return this.projectsService.getAllProjects(query);
  }

  @Get(':projectId/issues')
  async getIssuesByProject(@Param('projectId') projectId: string, @Query() query: QueryIssueDTO) {
    return this.projectsService.getAllIssuesByProject(projectId, query);
  }
}
