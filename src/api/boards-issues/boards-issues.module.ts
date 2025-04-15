import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { BoardIssue, BoardIssueSchema } from './schemas/board-issue.schema';

@Module({
  imports: [
    HttpModule,
    ConfigModule,
    MongooseModule.forFeature([
      {name: BoardIssue.name, schema: BoardIssueSchema }
  ])]
})
export class BoardsIssuesModule {}
