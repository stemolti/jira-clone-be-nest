import { Issue } from '@api/issues/schemas/issue.schema';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IRelease } from './interfaces/release.interface';
import { JiraReleasesResponse } from './interfaces/jira-releases.interface';
import { QueryReleaseDTO } from './dto/query-release.dto';

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

  async getAllReleasesByProject(projectIdOrKey: string, query: QueryReleaseDTO) {
    try {
      const releases = await this.fetchReleasesFromJiraByProject(projectIdOrKey, query);
      return releases;
    } catch (error) {
      this.logger.error('Error fetching releases', error);
      throw new InternalServerErrorException('Failed to fetch releases');
    }
  }


  private async fetchReleasesFromJiraByProject(projectIdOrKey: string, query: QueryReleaseDTO) {
    const jiraApiUrl = `${this.baseUrl}/rest/api/3/project/${projectIdOrKey}/version`;
    const url = new URL(jiraApiUrl);

    if (query.startAt) {
      url.searchParams.append('startAt', query.startAt.toString());
    }

    if (query.maxResults) {
      url.searchParams.append('maxResults', query.maxResults.toString());
    }

    if (query.orderBy) {
      url.searchParams.append('orderBy', query.orderBy);
    }

    if (query.query) {
      url.searchParams.append('query', query.query);
    }

    try {
      console.log('url', url.toString());
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Authorization': this.authHeader,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        this.logger.error(`Error fetching releases from Jira: ${response.statusText}`);
        throw new InternalServerErrorException('Failed to fetch releases from Jira');
      }

      const data: JiraReleasesResponse = await response.json();

      const releases: IRelease[] = data.values.map((release) => ({
        releaseId: release.id,
        projectId: release.projectId,
        name: release.name,
        description: release.description || '',
        releaseDate: release.releaseDate,
        released: release.released,
        archived: release.archived
      }));

      return releases;
    } catch (error) {
      this.logger.error('Error fetching releases from Jira', error);
    }
  }
}
