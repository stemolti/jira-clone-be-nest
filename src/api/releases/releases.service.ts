import { QueryIssueDTO } from '@api/issues/dto/query-issue.dto';
import { IIssue } from '@api/issues/interfaces/issue.interface';
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

  async getAllIssuesByRelease(releaseId: string, query: QueryIssueDTO) {
    try {
      const issues = await this.fetchIssuesFromJiraByRelease(releaseId, query);

      if (!issues) {
        this.logger.log('No issues found in DB, fetching from Jira');
      }

      return issues;
    } catch (error) {
      this.logger.error('Error fetching issues', error);
      throw new Error('Failed to fetch issues');
    }
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

    try {

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Authorization': this.authHeader,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        this.logger.error(`Failed to fetch issues from JIRA: ${response.statusText}`);
        return null;
      }

      const data = await response.json();

      const issues: IIssue[] = data.issues.map((issue) => ({
        issueId: issue.id,
        releaseId: releaseId,
        projectId: issue.fields.project.id,
        summary: issue.key,
        description: issue.fields.description?.content?.map((c) => c.content?.map((c) => c.text).join('')).join('')
      }));
      return issues;
    } catch (error) {
      this.logger.error('Error fetching issues from JIRA', error);
      return null;
    }
  }
}
