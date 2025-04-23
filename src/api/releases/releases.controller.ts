import { Controller, Get, Param, Query, UseInterceptors } from '@nestjs/common';
import { ReleasesService } from './releases.service';
import { QueryIssueDTO } from '@api/issues/dto/query-issue.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('releases')
@UseInterceptors(CacheInterceptor)
export class ReleasesController {
  constructor(private readonly releasesService: ReleasesService) { }

  @Get(':releaseId/issues')
  async getIssuesByRelease(@Param('releaseId') releaseId: string, @Query() query: QueryIssueDTO) {
    return this.releasesService.getAllIssuesByRelease(releaseId, query);
  }
}
