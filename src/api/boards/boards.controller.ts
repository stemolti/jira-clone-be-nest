import { CacheInterceptor } from '@nestjs/cache-manager';
import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { QueryBoardDTO } from './dto/query-board.dto';

@Controller('boards')
@UseInterceptors(CacheInterceptor)
export class BoardsController {
  constructor(private boardsService: BoardsService) {}

  @Get()
  async getBoards(@Query() query: QueryBoardDTO) {
    return this.boardsService.getAllBoards(query);
  }
}