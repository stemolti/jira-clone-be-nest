import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from '@nestjs/common';
import { SprintsService } from './sprints.service';
import { QuerySprintDTO } from './dto/query-sprint.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { QueryIssueDTO } from '@api/issues/dto/query-issue.dto';

@Controller('sprints')
@UseInterceptors(CacheInterceptor)
export class SprintsController {
  constructor(private readonly sprintsService: SprintsService) { }

  @Get(':boardId')
  async getSprintsByBoard(@Param('boardId', ParseIntPipe) boardId: number, @Query() query: QuerySprintDTO) {
    return this.sprintsService.getAllSprintsByBoard(boardId, query);
  }

  @Get(':sprintId/issues')
  async getIssuesBySprint(@Param('sprintId') sprintId: string, @Query() query: QueryIssueDTO) {
    return this.sprintsService.getAllIssuesBySprint(sprintId, query);
  }
}