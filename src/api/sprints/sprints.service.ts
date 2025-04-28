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
import { IIssue } from '@api/issues/interfaces/issue.interface';
import { JiraIssuesResponse } from '@api/issues/interfaces/jira-issue.interface';

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

      const jiraSprints = await this.fetchSprintsFromJiraByBoard(boardId, query);

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

  private async fetchSprintsFromJiraByBoard(boardId: number, query: QuerySprintDTO) {

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
      return sprints;

    } catch (error) {
      this.logger.error('Error fetching sprints from Jira', error);
      throw new InternalServerErrorException('Failed to fetch sprints from Jira');
    }
  }
}