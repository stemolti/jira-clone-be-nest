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
    const fetch = require('node-fetch');

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