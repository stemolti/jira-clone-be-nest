import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Board } from './schemas/board.schema';
import { QueryBoardDTO } from './dto/query-board.dto';
import { IBoard } from './interfaces/board.interface';
import { JiraBoardsResponse } from './interfaces/jira-board.interface';

@Injectable()
export class BoardsService {
  private readonly logger = new Logger(BoardsService.name);
  private readonly baseUrl: string;
  private readonly authHeader: string;

  constructor(
    private readonly configService: ConfigService,
    @InjectModel(Board.name) private readonly boardModel: Model<Board>,
  ) {
    this.baseUrl = this.configService.get<string>('JIRA_BASE_URL');
    const email = this.configService.get<string>('JIRA_EMAIL');
    const apiToken = this.configService.get<string>('JIRA_API_TOKEN');
    const encoded = Buffer.from(`${email}:${apiToken}`).toString('base64');
    this.authHeader = `Basic ${encoded}`;
  }


  async getAllBoards(projectIdOrKey: string, query: QueryBoardDTO) {
    try {
      const boards = await this.boardModel.find().exec();

      if (boards && boards.length > 0) {
        this.logger.log('Boards found on DB');
        return boards
      }
      this.logger.log('No boards found in DB, fetching from Jira');

      const jiraBoards = await this.fetchBoardsFromJira(projectIdOrKey, query);

      if (jiraBoards.length > 0) {
        const boards = await this.boardModel.insertMany(jiraBoards);
        this.logger.log(`Boards saved on DB: ${jiraBoards.length}`)
        return boards;
      }
    } catch (error) {

    }
  }


  private async fetchBoardsFromJira(projectIdOrKey: string, query: QueryBoardDTO) {

    const jiraApiUrl = `${this.baseUrl}/rest/agile/1.0/board`;

    const url = new URL(jiraApiUrl)

    const boards: IBoard[] = [];

    try {

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Authorization': this.authHeader,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        this.logger.error(`Error first fetching boards from Jira: ${response.statusText}`);
      }

      const data: JiraBoardsResponse = await response.json();

      console.log('Data received from Jira:', data);

      let remained: number = data.total


      do {

        query.startAt = parseInt(query.startAt.toString());
        query.maxResults = parseInt(query.maxResults.toString());

        const url = new URL(jiraApiUrl)

        if (query.startAt) {
          url.searchParams.append('startAt', query.startAt.toString());
        }

        if (query.maxResults) {
          url.searchParams.append('maxResults', query.maxResults.toString());
        }

        if (query.name) {
          url.searchParams.append('name', query.name);
        }

        if (query.projectKeyOrId) {
          url.searchParams.append('projectKeyOrId', query.projectKeyOrId);
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

        const nextData: JiraBoardsResponse = await nextResponse.json();

        console.log('Data received from Jira:', nextData);

        boards.push(...nextData.values.map((board) => ({
          boardId: board.id,
          projectId: board.location.projectId,
          key: board.location.projectKey,
          name: board.name
        })));

        query.startAt += query.maxResults;
        remained -= query.maxResults;

      } while ((query.startAt < (remained + data.total) - 1));

      return boards;
    } catch (error) {
      this.logger.error('Error fetching boards from Jira', error);
    }
  }
}
