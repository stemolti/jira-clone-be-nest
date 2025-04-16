import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Board } from './schemas/board.schema';
import { QueryBoardDTO } from './dto/query-board.dto';

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
  
  
    async getAllBoards(query: QueryBoardDTO): Promise<Partial<Board>[]> {
      try {
        const boards = await this.boardModel.find().exec();

        if(boards && boards.length > 0){
          this.logger.log('Boards found on DB');
          return boards
        }
        this.logger.log('No boards found in DB, fetching from Jira');

        const jiraBoards = await this.fetchBoardsFromJira(query);
        

      }catch (error) {

      }
    }
  
  
    private async fetchBoardsFromJira(query: QueryBoardDTO): Promise<Partial<Board>[]> {
      const fetch = require('node-fetch');
  
      const jiraApiUrl = `${this.baseUrl}/rest/agile/1.0/board`;
  
      const url = new URL (jiraApiUrl)
  
      if(query.startAt){
        url.searchParams.append('startAt', query.startAt.toString());
      }
  
      if(query.maxResults){
        url.searchParams.append('maxResults', query.maxResults.toString());
      }
  
      if(query.orderBy){
        url.searchParams.append('orderBy', query.orderBy);
      }
  
      if(query.projectKeyOrId){
        url.searchParams.append('projectKeyOrId', query.projectKeyOrId);
      }
  
      try {
       const response = await fetch(jiraApiUrl, {
        method: 'GET',
        headers: {
          'Authorization': this.authHeader,
          'Accept': 'application/json'
        }
       });
  
       if(!response.ok){
        this.logger.error(`Error fetching boards from Jira: ${response.statusText}`);
        throw new InternalServerErrorException('Failed to fetch boards from Jira');
       }
  
       const data: any = await response.json();
       console.log('Data received from Jira:', data);
       const boards: Partial<Board>[] = data.values.map((board: any) => ({
        boardId: board.id,
        projectId: query.projectKeyOrId,
        name: board.name
       }));
       this.logger.log(` Mapped boards ${boards}`);
       return boards;
      } catch (error) {
        this.logger.error('Error fetching boards from Jira', error);
        throw new InternalServerErrorException('Failed to fetch boards from Jira'); 
      }
    }
}
