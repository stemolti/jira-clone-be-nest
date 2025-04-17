import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { IssuesService } from './issues.service';
import { QueryIssueDTO } from './dto/query-issue.dto';
import { Issue } from './schemas/issue.schema';

@Controller('issues')
export class IssuesController {
  constructor(private readonly issuesService: IssuesService) { }

  @Get(':sprintId')
  async getIssuesBySprint(@Param('sprintId') sprintId: string, @Query() query: QueryIssueDTO) {
    return this.issuesService.getAllIssuesBySprint(sprintId, query);
  }
}
