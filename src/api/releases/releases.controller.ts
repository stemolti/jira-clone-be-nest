import { Controller, Get, Param, Query, UseInterceptors } from '@nestjs/common';
import { ReleasesService } from './releases.service';
import { QueryIssueDTO } from '@api/issues/dto/query-issue.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { QueryReleaseDTO } from './dto/query-release.dto';

@Controller('releases')
@UseInterceptors(CacheInterceptor)
export class ReleasesController {
  constructor(private readonly releasesService: ReleasesService) { }

  @Get(':releaseId/issues')
  async getIssuesByRelease(@Param('releaseId') releaseId: string, @Query() query: QueryIssueDTO) {
    return this.releasesService.getAllIssuesByRelease(releaseId, query);
  }

  @Get('projects/:projectIdOrKey/releases')
  async getReleasesByProject(@Param('projectIdOrKey') projectIdOrKey: string, @Query() query: QueryReleaseDTO) {
    return this.releasesService.getAllReleasesByProject(projectIdOrKey, query);
  }
}