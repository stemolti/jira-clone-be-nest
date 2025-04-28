import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Project } from './schemas/project.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QueryProjectDTO } from './dto/query-project.dto';
import { IProject } from './interfaces/project.interface';
import { JiraProjectsResponse } from './interfaces/jira-projects.interface';

@Injectable()
export class ProjectsService {
  private readonly logger = new Logger(ProjectsService.name);
  private readonly baseUrl: string;
  private readonly authHeader: string;

  constructor(
    private readonly configService: ConfigService,
    @InjectModel(Project.name) private readonly projectModel: Model<Project>
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
      let remained: number = -1;

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

        if (remained < 0) {
          remained = nextData.total
        }

        console.log('Data received from Jira:', nextData);

        projects.push(...nextData.values.map((project) => ({
          projectId: project.id,
          name: project.name,
          description: project.description || ''
        })));

        query.startAt += nextData.values.length;
        remained -= nextData.values.length;

      } while (remained > 0);

      return projects;
    } catch (error) {
      this.logger.error('Error fetching projects from Jira', error);
    }
  }



}