import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QuerySprintDTO } from './dto/query-sprint.dto';
import { Sprint } from './schemas/sprint.schema';
import { ISprint } from './interfaces/sprint.interface';
import { JiraSprintsResponse } from './interfaces/jira-sprint.interface';
import { Issue } from '@api/issues/schemas/issue.schema';
import { QueryIssueDTO } from '@api/issues/dto/query-issue.dto';
import { JiraIssuesResponse } from '@api/issues/interfaces/jira-issue.interface';
import { IIssue } from '@api/issues/interfaces/issue.interface';

@Injectable()
export class SprintsService {
  private readonly logger = new Logger(SprintsService.name);
  private readonly baseUrl: string;
  private readonly authHeader: string;

  constructor(
    private readonly configService: ConfigService,
    @InjectModel(Sprint.name) private readonly sprintModel: Model<Sprint>,
    @InjectModel(Issue.name) private readonly issueModel: Model<Sprint>,
  ) {
    this.baseUrl = this.configService.get<string>('JIRA_BASE_URL');
    const email = this.configService.get<string>('JIRA_EMAIL');
    const apiToken = this.configService.get<string>('JIRA_API_TOKEN');
    const encoded = Buffer.from(`${email}:${apiToken}`).toString('base64');
    this.authHeader = `Basic ${encoded}`;
  }

  async getAllSprintsByBoard(boardId: number, query: QuerySprintDTO) {
    try {
      const sprints = await this.sprintModel.find({ boardId: boardId }).exec();

      if (sprints && sprints.length > 0) {
        this.logger.log('Sprints found on DB');
        return sprints;
      }
      this.logger.log('No sprints found in DB, fetching from Jira');

      const jiraSprints = await this.fetchSprintsFromJira(boardId, query);

      if (jiraSprints.length > 0) {
        await this.sprintModel.insertMany(jiraSprints);
        this.logger.log(`Sprints saved on DB: ${jiraSprints.length}`);
        const sprints = await this.sprintModel.find({ boardId }).exec();
        return sprints;
      }

    } catch (error) {
      this.logger.error('Error fetching sprints', error);
      throw new InternalServerErrorException('Failed to fetch sprints');
    }
  }

  private async fetchSprintsFromJira(boardId: number, query: QuerySprintDTO) {

    const fetch = require('node-fetch');
    const jiraApiUrl = `${this.baseUrl}/rest/agile/1.0/board/${boardId}/sprint`;
    const url = new URL(jiraApiUrl);

    if (query.startAt) {
      url.searchParams.append('startAt', query.startAt.toString());
    }

    if (query.maxResults) {
      url.searchParams.append('maxResults', query.maxResults.toString());
    }

    if (query.state) {
      url.searchParams.append('state', query.state.toString());
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
        this.logger.error('Error fetching sprints from Jira', response.statusText);
        throw new InternalServerErrorException(`Failed to fetch sprints from Jira: ${response.statusText}`);
      }

      const data: JiraSprintsResponse = await response.json();

      console.log('Data received from', data);

      const sprints: ISprint[] = data.values.map((sprint) => ({
        sprintId: sprint.id,
        boardId: boardId,
        name: sprint.name,
        state: sprint.state,
        startDate: sprint.startDate,
        endDate: sprint.endDate,
        goal: sprint.goal,
      }));

      this.logger.log(`Fetched ${sprints.length} sprints from Jira`);
      this.logger.log(` Mapped sprints ${sprints}`);

      return sprints;

    } catch (error) {
      this.logger.error('Error fetching sprints from Jira', error);
      throw new InternalServerErrorException('Failed to fetch sprints from Jira');
    }
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
        description: issue.fields.description.content.map((c) => c.content.map((c) => c.text).join('')).join(''),
        sprintId: sprintId
      }));

      this.logger.log(`Issues fetched from Jira: ${issues.length}`);
      return issues;
    } catch (error) {
      this.logger.error('Error fetching issues from Jira', error);
      throw new InternalServerErrorException('Failed to fetch issues from Jira');
    }
  }
}