import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Issue } from './schemas/issue.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateIssueDTO } from './dto/create-issue.dto';

@Injectable()
export class IssuesService {
  private readonly logger = new Logger(IssuesService.name);
  private readonly baseUrl: string;
  private readonly authHeader: string;


  constructor(
    private readonly configService: ConfigService,
    @InjectModel(Issue.name) private readonly boardModel: Model<Issue>,
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
        throw new InternalServerErrorException('Impossibile creare l\'issue su Jira');
      }

      return issue;
    } catch (error) {
      this.logger.error(`Error creating issue: ${error.message}`);
      throw new InternalServerErrorException('Errore durante la creazione dell\'issue');
    }
  }

  private async createIssueOnJira(createDTO: CreateIssueDTO) {
    const jiraApiUrl = `${this.baseUrl}/rest/api/3/issue`;
    const issueConfigUrl = `${this.baseUrl}/rest/agile/1.0/board/${createDTO.boardId}/configuration`;

    const issueConfigRes = await fetch(issueConfigUrl, {
      method: 'GET',
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

    const data = await issueConfigRes.json();

    const columnNames: string[] = data.columns.map(c => c.name);

    if (!columnNames.includes('To Do')) {
      throw new NotFoundException(
        `Colonna '${'To Do'}' non trovata su board ${createDTO.boardId}`,
      );
    }


    const issueBody = {
      fields: {
        summary: createDTO.name,
        description: {
          content: [
            {
              content: [
                {
                  text: createDTO.description || '',
                }
              ],
            }
          ],
        },
        status: {
          name: "To Do",
        }
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
}