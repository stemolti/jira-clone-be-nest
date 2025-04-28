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
      const existing = await this.projectModel.find().exec();
      if (existing.length) {
        this.logger.log('Projects found on DB');
        return existing;
      }

      this.logger.log('No projects in DB, fetching from Jira');
      const jiraProjects = await this.fetchProjectsFromJira(query);

      if (jiraProjects.length) {
        await this.projectModel.insertMany(jiraProjects);
        this.logger.log(`Projects saved on DB: ${jiraProjects.length}`);
      }

      return this.projectModel.find().exec();
    } catch (error) {
      this.logger.error('Error fetching projects', error);
      throw new InternalServerErrorException('Failed to fetch projects');
    }
  }

  private async fetchProjectsFromJira(query: QueryProjectDTO) {

    const jiraApiUrl = `${this.baseUrl}/rest/api/3/project/search`;

    const projects: IProject[] = [];


    try {

      let total = Infinity

      while (query.startAt < total) {

        const url = new URL(jiraApiUrl)

        query.startAt = parseInt(query.startAt.toString());

        if (query.startAt) {
          url.searchParams.set('startAt', query.startAt.toString());
        }

        if (query.maxResults) {
          url.searchParams.set('maxResults', query.maxResults.toString());
        }

        if (query.query) {
          url.searchParams.set('query', query.query);
        }

        const response = await fetch(url.toString(), {
          method: 'GET',
          headers: {
            'Authorization': this.authHeader,
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          this.logger.error(`Error fetching projects from Jira: ${response.statusText}`);
        }

        const data: JiraProjectsResponse = await response.json();

        // Deconstructing
        ({ total } = data)

        projects.push(...data.values.map((project) => ({
          projectId: project.id,
          name: project.name,
          description: project.description
        })));

        query.startAt += data.values.length;
      }

      return projects;
    } catch (error) {
      this.logger.error('Error fetching projects from Jira', error);
    }
  }
}