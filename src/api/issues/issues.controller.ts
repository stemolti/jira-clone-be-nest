import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query, UseInterceptors } from '@nestjs/common';
import { IssuesService } from './issues.service';
import { QueryIssueDTO } from './dto/query-issue.dto';
import { Issue } from './schemas/issue.schema';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { CreateIssueDTO } from './dto/create-issue.dto';
import { UpdateIssueDTO } from './dto/update-issue.dto';

@Controller('issues')
@UseInterceptors(CacheInterceptor)
export class IssuesController {
  constructor(private readonly issuesService: IssuesService) { }

  @Post()
  async create(@Body() createDTO: CreateIssueDTO) {
    return this.issuesService.createIssue(createDTO);
  }

  @Put(':issueId')
  async update(@Param('issueId') issueId: string, @Body() updateDTO: UpdateIssueDTO) {
    return this.issuesService.updateIssue(issueId, updateDTO);
  }
}
