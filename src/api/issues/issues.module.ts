import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { IssuesService } from './issues.service';
import { IssuesController } from './issues.controller';
import { Issue, IssueSchema } from './schemas/issue.schema';

@Module({
  imports: [
    HttpModule,
    ConfigModule,
    MongooseModule.forFeature([
      {name: Issue.name, schema: IssueSchema }
  ])],
  controllers: [IssuesController],
  providers: [IssuesService],
  exports: [IssuesService]
})
export class IssuesModule {}