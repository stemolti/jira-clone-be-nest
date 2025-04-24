import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Project } from './schemas/project.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QueryProjectDTO } from './dto/query-project.dto';
import { IProject } from './interfaces/project.interface';
import { JiraProjectsResponse } from './interfaces/jira-projects.interface';
import { IIssue } from '@api/issues/interfaces/issue.interface';
import { JiraIssuesResponse } from '@api/issues/interfaces/jira-issue.interface';
import { QueryIssueDTO } from '@api/issues/dto/query-issue.dto';
import { Issue } from '@api/issues/schemas/issue.schema';
import { QueryReleaseDTO } from '@api/releases/dto/query-release.dto';
import { stat } from 'fs';
import { parse } from 'path';
import { JiraReleasesResponse } from '@api/releases/interfaces/jira-releases.interface';
import { IRelease } from '@api/releases/interfaces/release.interface';

@Injectable()
export class ProjectsService {
  private readonly logger = new Logger(ProjectsService.name);
  private readonly baseUrl: string;
  private readonly authHeader: string;

  constructor(
    //private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    //private readonly projectsService: ProjectsService
    @InjectModel(Project.name) private readonly projectModel: Model<Project>,
    @InjectModel(Issue.name) private readonly issueModel: Model<Issue>,
  ) {
    this.baseUrl = this.configService.get<string>('JIRA_BASE_URL');
    const email = this.configService.get<string>('JIRA_EMAIL');
    const apiToken = this.configService.get<string>('JIRA_API_TOKEN');
    const encoded = Buffer.from(`${email}:${apiToken}`).toString('base64');
    this.authHeader = `Basic ${encoded}`;
  }


  async getAllProjects(query: QueryProjectDTO) {
    try {
      const projects = await this.projectModel.find().exec();

      if (projects && projects.length > 0) {
        this.logger.log('Projects found on DB');
        return projects
      }
      this.logger.log('No projects found in DB, fetching from Jira');

      const jiraProjects = await this.fetchProjectsFromJira(query);

      if (jiraProjects.length > 0) {
        await this.projectModel.insertMany(jiraProjects);
        this.logger.log(`Projects saved on DB: ${jiraProjects.length}`);
      }

      return await this.projectModel.find().exec();
    } catch (error) {
      this.logger.error('Error fetching projects', error);
      throw new InternalServerErrorException('Failed to fetch projects');
    }
  }


  private async fetchProjectsFromJira(query: QueryProjectDTO) {

    const jiraApiUrl = `${this.baseUrl}/rest/api/3/project/search`;

    const projects: IProject[] = [];

    const url = new URL(jiraApiUrl)

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Authorization': this.authHeader,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        this.logger.error(`Error first fetching projects from Jira: ${response.statusText}`);
      }

      const data: JiraProjectsResponse = await response.json();

      console.log('Data received from Jira:', data);

      let remained: number = data.total

      do {

        query.startAt = parseInt(query.startAt.toString());
        query.maxResults = parseInt(query.maxResults.toString());

        const url = new URL(jiraApiUrl)

        if (query.startAt) {
          url.searchParams.set('startAt', query.startAt.toString());
        }

        if (query.maxResults) {
          url.searchParams.set('maxResults', query.maxResults.toString());
        }

        if (query.query) {
          url.searchParams.set('query', query.query);
        }

        const nextResponse = await fetch(url.toString(), {
          method: 'GET',
          headers: {
            'Authorization': this.authHeader,
            'Accept': 'application/json'
          }
        });

        if (!nextResponse.ok) {
          this.logger.error(`Error fetching projects from Jira: ${nextResponse.statusText}`);
        }

        const nextData: JiraProjectsResponse = await nextResponse.json();

        console.log('Data received from Jira:', nextData);

        projects.push(...nextData.values.map((project) => ({
          projectId: project.id,
          name: project.name,
          description: project.description || ''
        })));

        query.startAt += query.maxResults;
        remained -= query.maxResults;

      } while (query.startAt < remained + data.total - 1)

      return projects;
    } catch (error) {
      this.logger.error('Error fetching projects from Jira', error);
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