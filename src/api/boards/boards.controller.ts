import { CacheInterceptor } from '@nestjs/cache-manager';
import { Controller, Get, Param, Query, UseInterceptors } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { QueryBoardDTO } from './dto/query-board.dto';

@Controller('projects')
@UseInterceptors(CacheInterceptor)
export class BoardsController {
  constructor(private boardsService: BoardsService) {}

  @Get(':projectIdOrKey/boards')
  async getBoards(@Param('projectIdOrKey') projectIdOrKey: string, @Query() query: QueryBoardDTO) {
    return this.boardsService.getAllBoards(projectIdOrKey, query);
  }
}