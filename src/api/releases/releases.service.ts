import { QueryIssueDTO } from '@api/issues/dto/query-issue.dto';
import { Issue } from '@api/issues/schemas/issue.schema';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ReleasesService {
  private readonly logger = new Logger(ReleasesService.name);
  private readonly baseUrl: string;
  private readonly authHeader: string;

  constructor(private readonly configService: ConfigService,
    @InjectModel(Issue.name) private readonly issueModel: Model<Issue>) {
    this.baseUrl = this.configService.get<string>('JIRA_BASE_URL');
    const email = this.configService.get<string>('JIRA_EMAIL');
    const apiToken = this.configService.get<string>('JIRA_API_TOKEN');
    const encoded = Buffer.from(`${email}:${apiToken}`).toString('base64');
    this.authHeader = `Basic ${encoded}`;
  }

  private async fetchIssuesFromJiraByRelease(releaseId: string, query: QueryIssueDTO) {

    const jiraApiUrl = `${this.baseUrl}/rest/api/3/search`;

    const url = new URL(jiraApiUrl);

    query.jql = `fixVersion = ${releaseId}`;

    if (query.startAt) {
      url.searchParams.append('startAt', query.startAt.toString());
    }

    if (query.maxResults) {
      url.searchParams.append('maxResults', query.maxResults.toString())
    }
  }
}
