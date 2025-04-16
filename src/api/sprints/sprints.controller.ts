import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { SprintsService } from './sprints.service';
import { QuerySprintDTO } from './dto/query-sprint.dto';
import { Sprint } from './schemas/sprint.schema';

@Controller('sprints')
export class SprintsController {
  constructor(private readonly sprintsService: SprintsService) { }

  @Get(':boardId')
  async getSprintsByBoard(@Param('boardId', ParseIntPipe) boardId: number, @Query() query: QuerySprintDTO): Promise<Partial<Sprint>[]> {
    return this.sprintsService.getAllSprintsByBoard(boardId, query);
  }
}