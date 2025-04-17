import { Controller, Get, Logger, Param, ParseIntPipe, Query, UseInterceptors } from '@nestjs/common';
import { SprintsService } from './sprints.service';
import { QuerySprintDTO } from './dto/query-sprint.dto';
import { ISprint } from './interfaces/sprint.interface';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('sprints')
@UseInterceptors(CacheInterceptor)
export class SprintsController {
  constructor(private readonly sprintsService: SprintsService) { }

  @Get(':boardId')
  async getSprintsByBoard(@Param('boardId', ParseIntPipe) boardId: number, @Query() query: QuerySprintDTO) {
    return this.sprintsService.getAllSprintsByBoard(boardId, query);
  }
}