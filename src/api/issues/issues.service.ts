import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { Issue } from './schemas/issue.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { QueryIssueDTO } from './dto/query-issue.dto';
import { IIssue } from './interfaces/issue.interface';
import { JiraIssuesResponse } from './interfaces/jira-issue.interface';

@Injectable()
export class IssuesService {
  private readonly logger = new Logger(IssuesService.name);
  private readonly baseUrl: string;
  private readonly authHeader: string;

  constructor(
    private readonly configService: ConfigService,
    @InjectModel(Issue.name) private readonly issueModel: Model<Issue>,
  ) {
    this.baseUrl = this.configService.get<string>('JIRA_BASE_URL');
    const email = this.configService.get<string>('JIRA_EMAIL');
    const apiToken = this.configService.get<string>('JIRA_API_TOKEN');
    const encoded = Buffer.from(`${email}:${apiToken}`).toString('base64');
    this.authHeader = `Basic  ${encoded}`;
  }

  async getAllIssuesBySprint(sprintId: string, query: QueryIssueDTO) {
    try {
      const issues = await this.issueModel.find({ sprintId }).exec();

      if (issues && issues.length > 0) {
        this.logger.log('Issues found on DB');
        return issues;
      }
      this.logger.log('No issues found in DB, fetching from Jira');

      const jiraIssues = await this.fetchIssuesFromJira(sprintId, query);

      if (jiraIssues.length > 0) {
        await this.issueModel.insertMany(jiraIssues);
        this.logger.log(`Issues saved on DB: ${jiraIssues.length}`);
      }

      return await this.issueModel.find({ sprintId }).exec();
    } catch (error) {
      this.logger.error('Error fetching issues', error);
      throw new InternalServerErrorException('Failed to fetch issues');
    }
  }

  private async fetchIssuesFromJira(sprintId: string, query: QueryIssueDTO) {
    const fetch = require('node-fetch');
    const jiraApiUrl = `${this.baseUrl}/rest/agile/1.0/sprint/${sprintId}/issue`;
    const url = new URL(jiraApiUrl);

    if (query.startAt) {
      url.searchParams.append('startAt', query.startAt.toString());
    }

    if (query.maxResults) {
      url.searchParams.append('maxResults', query.maxResults.toString());
    }

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Authorization': this.authHeader,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        this.logger.error(`Error fetching issues from Jira: ${response.statusText}`);
        throw new InternalServerErrorException(`Failed to fetch issues from Jira: ${response.statusText}`);
      }

      const data: JiraIssuesResponse = await response.json();

      const issues: IIssue[] = data.issues.map((issue) => ({
        issueId: issue.id,
        projectId: issue.fields.project.id,
        name: issue.key,
        description: issue.fields.description,
        sprintId: sprintId
      }));

      this.logger.log(`Issues fetched from Jira: ${issues.length}`);
      return issues;
    } catch (error) {
      this.logger.error('Error fetching issues from Jira', error);
      throw new InternalServerErrorException('Failed to fetch issues from Jira');
    }
  }

  async getAllIssuesByProject(projectId: string, query: QueryIssueDTO) {
    try {
      const issues = await this.issueModel.find({ projectId: projectId }).exec();
      if (issues && issues.length > 0) {
        this.logger.log('Issues found on DB');
        return issues;
      }

      this.logger.log('No issues found in DB, fetching from Jira');

      const jiraIssues = await this.fetchIssuesFromJiraByProject(projectId, query);

      if (jiraIssues.length > 0) {
        await this.issueModel.insertMany(jiraIssues);
        this.logger.log(`Issues saved on DB: ${jiraIssues.length}`);
      }

      return await this.issueModel.find({ projectId: projectId }).exec();

    } catch (error) {
      this.logger.error('Error fetching issues', error);
      throw new InternalServerErrorException('Failed to fetch issues');
    }
  }

  private async fetchIssuesFromJiraByProject(projectId: string, query: QueryIssueDTO) {

    const fetch = require('node-fetch');
    const jiraApiUrl = `${this.baseUrl}/rest/api/3/search`;
    const url = new URL(jiraApiUrl);

    query.jql = `project = ${projectId}`;

    if (query.startAt) {
      url.searchParams.append('startAt', query.startAt.toString());
    }

    if (query.maxResults) {
      url.searchParams.append('maxResults', query.maxResults.toString());
    }

    if (query.jql) {
      url.searchParams.append('jql', query.jql);
    }

    this.logger.log('url', url.toString());
    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Authorization': this.authHeader,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        this.logger.error(`Error fetching issues from Jira: ${response.statusText}`);
        throw new InternalServerErrorException(`Failed to fetch issues from Jira: ${response.statusText}`);
      }

      const data: JiraIssuesResponse = await response.json();
      const issues: IIssue[] = data.issues.map((issue) => ({
        issueId: issue.id,
        projectId: issue.fields.project.id,
        name: issue.key,
        description: issue.fields.description,
      }));

      this.logger.log(`Issues fetched from Jira: ${issues.length}`);
      return issues;
    } catch (error) {
      this.logger.error('Error fetching issues from Jira', error);
      throw new InternalServerErrorException('Failed to fetch issues from Jira');
    }
  }
}