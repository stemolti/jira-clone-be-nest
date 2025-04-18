import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from '@nestjs/common';
import { IssuesService } from './issues.service';
import { QueryIssueDTO } from './dto/query-issue.dto';
import { Issue } from './schemas/issue.schema';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('issues')
@UseInterceptors(CacheInterceptor)
export class IssuesController {
  constructor(private readonly issuesService: IssuesService) { }
}
