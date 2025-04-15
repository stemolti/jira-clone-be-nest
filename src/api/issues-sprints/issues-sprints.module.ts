import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { IssueSprint, IssueSprintSchema } from './schemas/issue-sprint.schema';

@Module({
  imports: [
    HttpModule,
    ConfigModule,
    MongooseModule.forFeature([
      {name: IssueSprint.name, schema: IssueSprintSchema }
  ])]
})
export class IssuesSprintsModule {}
