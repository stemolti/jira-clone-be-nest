import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Issue } from './schemas/issue.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateIssueDTO } from './dto/create-issue.dto';
import { JiraConfigIssueResponse } from './interfaces/jira-config-issue.interface';
import { UpdateIssueDTO } from './dto/update-issue.dto';
import { QueryIssueDTO } from './dto/query-issue.dto';
import { JiraIssuesResponse } from './interfaces/jira-issue.interface';
import { IIssue } from './interfaces/issue.interface';

@Injectable()
export class IssuesService {
  private readonly logger = new Logger(IssuesService.name);
  private readonly baseUrl: string;
  private readonly authHeader: string;


  constructor(
    private readonly configService: ConfigService,
    @InjectModel(Issue.name) private readonly boardModel: Model<Issue>,
    @InjectModel(Issue.name) private readonly issueModel: Model<Issue>,

  ) {
    this.baseUrl = this.configService.get<string>('JIRA_BASE_URL');
    const email = this.configService.get<string>('JIRA_EMAIL');
    const apiToken = this.configService.get<string>('JIRA_API_TOKEN');
    const encoded = Buffer.from(`${email}:${apiToken}`).toString('base64');
    this.authHeader = `Basic ${encoded}`;
  }

  async createIssue(createDTO: CreateIssueDTO) {
    try {
      const issue = await this.createIssueOnJira(createDTO);

      if (!issue) {
        this.logger.log('Impossibile creare l\'issue su Jira');
      }

      return issue;
    } catch (error) {
      this.logger.log(`Errore durante la creazione dell\'issue: ${error.message}`);
    }
  }

  private async createIssueOnJira(createDTO: CreateIssueDTO) {
    const jiraApiUrl = `${this.baseUrl}/rest/api/3/issue`;
    const issueConfigUrl = `${this.baseUrl}/rest/agile/1.0/board/${createDTO.boardId}/configuration`;

    const issueConfigRes = await fetch(issueConfigUrl, {
      headers: {
        Authorization: this.authHeader,
        Accept: 'application/json',
      },
    });

    if (!issueConfigRes.ok) {
      this.logger.error(
        `Errore recupero config board: ${issueConfigRes.statusText}`,
      );
      throw new InternalServerErrorException('Impossibile recuperare configurazione board');
    }

    const data: JiraConfigIssueResponse = await issueConfigRes.json();

    const columnNames: string[] = data.columnConfig.columns.map((column) => column.name);

    if (!columnNames.includes('To Do')) {
      throw new NotFoundException(
        `Colonna '${'To Do'}' non trovata su board ${createDTO.boardId}`,
      );
    }

    const issueBody = {
      fields: {
        description: {
          content: [
            {
              content: [
                {
                  text: createDTO.description || '',
                  type: "text"
                }
              ],
              type: "paragraph"
            }
          ],
          type: "doc",
          version: 1
        },
        issuetype: {
          name: "Task"
        },
        project: {
          id: createDTO.projectId
        },
        summary: createDTO.summary
      }
    };

    try {
      const response = await fetch(jiraApiUrl, {
        method: 'POST',
        headers: {
          'Authorization': this.authHeader,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(issueBody),
      });

      if (!response.ok) {
        this.logger.error(`Failed to create issue on Jira: ${response.statusText}`);
        return null;
      }

      const data = await response.json();

      return data;
    } catch (error) {
      this.logger.error(`Error creating issue on Jira: ${error.message}`);
      return null;
    }
  }

  async updateIssue(projectId: string, issueId: string, updateDTO: UpdateIssueDTO) {
    try {
      const issue = await this.editIssueOnJira(projectId, issueId, updateDTO);

      if (!issue) {
        this.logger.log('Impossibile aggiornare l\'issue');
      }
      this.logger.log(`Issue updated: ${issueId}`);
      return issue;
    } catch (error) {
      this.logger.log(`Errore durante l\'aggiornamento dell\'issue: ${error.message}`);
    }
  }

  private async editIssueOnJira(projectId: string, issueId: string, updateDTO: UpdateIssueDTO) {
    const jiraApiUrl = `${this.baseUrl}/rest/api/3/issue/${issueId}`;

    const issueBody = {
      fields: {
        summary: updateDTO.summary,
        description: {
          type: "doc",
          version: 1,
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: updateDTO.description
                }
              ]
            }
          ]
        }
      }
    }

    try {
      const response = await fetch(jiraApiUrl, {
        method: 'PUT',
        headers: {
          'Authorization': this.authHeader,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(issueBody),
      });

      if (!response.ok) {
        this.logger.error(`Failed to update issue on Jira: ${response.statusText}`);
        return null;
      }

      const data = await response.statusText;
      this.logger.log(`Issue updated on Jira: ${issueId}`);

      return data;
    } catch (error) {
      this.logger.error(`Error updating issue on Jira: ${error.message}`);
      return null
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
        summary: issue.key,
        description: issue.fields.description?.content?.map((content) => content?.content?.map((c) => c.text).join(' ')).join(' '),
        status: issue.fields.status.name,
      }));

      this.logger.log(`Issues fetched from Jira: ${issues.length}`);
      return issues;
    } catch (error) {
      this.logger.error('Error fetching issues from Jira', error);
      throw new InternalServerErrorException('Failed to fetch issues from Jira');
    }
  }
}