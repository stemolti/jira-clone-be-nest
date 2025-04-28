import { Controller, Get, Param, Query, UseInterceptors } from '@nestjs/common';
import { ReleasesService } from './releases.service';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { QueryReleaseDTO } from './dto/query-release.dto';

@Controller('projects')
@UseInterceptors(CacheInterceptor)
export class ReleasesController {
  constructor(private readonly releasesService: ReleasesService) { }

  @Get(':projectIdOrKey/releases')
  async getReleasesByProject(@Param('projectIdOrKey') projectIdOrKey: string, @Query() query: QueryReleaseDTO) {
    return this.releasesService.getAllReleasesByProject(projectIdOrKey, query);
  }
}