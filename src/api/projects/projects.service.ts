import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Project } from './schemas/project.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

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
  ) {
    this.baseUrl = this.configService.get<string>('JIRA_BASE_URL');
    const email = this.configService.get<string>('JIRA_EMAIL');
    const apiToken = this.configService.get<string>('JIRA_API_TOKEN');
    const encoded = Buffer.from(`${email}:${apiToken}`).toString('base64');
    this.authHeader = `Basic ${encoded}`;
  }


  async getAllProjects(): Promise<Partial<Project>[]> {
    try {
      const projects = await this.projectModel.find().exec();
      if(projects && projects.length > 0){
        this.logger.log('Projects finded on DB');
        return projects
      }
      this.logger.log('No projects found in DB, fetching from Jira');

      const jiraProjects = await this.fetchProjectsFromJira();

      if ( jiraProjects.length > 0) {
        await this.projectModel.insertMany(jiraProjects);
        this.logger.log(`Projects saved on DB: ${jiraProjects.length}`);
      }
      return await this.projectModel.find().exec();
    }catch (error) {
      this.logger.error('Error fetching projects', error);
      throw new InternalServerErrorException('Failed to fetch projects');
    }
  }


  private async fetchProjectsFromJira(): Promise<Partial<Project>[]> {
    const fetchModule = await import('node-fetch');
    const fetch = fetchModule.default;
    const url = `${this.baseUrl}/rest/api/3/project/search`;
    try {
     const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': this.authHeader,
        'Accept': 'application/json'
      }
     });

     if(!response.ok){
      this.logger.error(`Error fetching projects from Jira: ${response.statusText}`);
      throw new InternalServerErrorException('Failed to fetch projects from Jira');
     }

     const data: any = await response.json();
     console.log('Data ricevuta da Jira:', data);
     const projects: Partial<Project>[] = data.values.map((project: any) => ({
      name: project.name,
      description: project.description || ''
     }));
     //console.log('Progetti mappati:', projects);
     this.logger.log(` Mapped projects ${projects}`);
     return projects;
    } catch (error) {
      this.logger.error('Error fetching projects from Jira', error);
      throw new InternalServerErrorException('Failed to fetch projects from Jira'); 
    }
  }

}









/*

// src/jira/jira.service.ts
import { Injectable, HttpService, Logger } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { ProjectsService } from '../projects/projects.service';

@Injectable()
export class JiraService {
  private readonly logger = new Logger(JiraService.name);
  private readonly baseUrl: string;
  private readonly authHeader: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly projectsService: ProjectsService,
  ) {
    this.baseUrl = this.configService.get<string>('JIRA_BASE_URL') || 'https://your-domain.atlassian.net';
    const email = this.configService.get<string>('JIRA_EMAIL') || 'email@example.com';
    const apiToken = this.configService.get<string>('JIRA_API_TOKEN') || '<api_token>';
    const encoded = Buffer.from(`${email}:${apiToken}`).toString('base64');
    this.authHeader = `Basic ${encoded}`;
  }

  async syncProjects(): Promise<void> {
    const url = `${this.baseUrl}/rest/api/3/project/search`;
    try {
      const response = await lastValueFrom(
        this.httpService.get(url, {
          headers: {
            'Authorization': this.authHeader,
            'Accept': 'application/json',
          },
        }),
      );
      const data = response.data;
      this.logger.log(`Trovati ${data.values.length} progetti da Jira`);
      for (const project of data.values) {
        // Mappatura dei dati in base all’ERD:
        // Utilizziamo solo: id (salvato come jiraId), name e, se presente, il nome della categoria come description.
        const projectData = {
          jiraId: project.id,
          name: project.name,
          description: project.projectCategory ? project.projectCategory.name : '',
        };
        await this.projectsService.createOrUpdateProject(projectData);
      }
    } catch (error) {
      this.logger.error('Errore nella sincronizzazione dei progetti da Jira', error);
      throw error;
    }
  }
}


*/