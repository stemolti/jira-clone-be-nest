import { Controller, Get, Logger, Param, ParseIntPipe, Query } from '@nestjs/common';
import { SprintsService } from './sprints.service';
import { QuerySprintDTO } from './dto/query-sprint.dto';
import { ISprint } from './interfaces/sprint.interface';

@Controller('sprints')
export class SprintsController {
  constructor(private readonly sprintsService: SprintsService) { }

  @Get(':boardId')
  async getSprintsByBoard(@Param('boardId', ParseIntPipe) boardId: number, @Query() query: QuerySprintDTO): Promise<Partial<ISprint>[]> {
    return this.sprintsService.getAllSprintsByBoard(boardId, query);
  }
}