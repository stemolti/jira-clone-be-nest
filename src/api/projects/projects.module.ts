import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { Project, ProjectSchema } from './schemas/project.schema';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { IssuesModule } from '@api/issues/issues.module';
import { Issue, IssueSchema } from '@api/issues/schemas/issue.schema';

@Module({
  imports: [
    HttpModule,
    ConfigModule,
    MongooseModule.forFeature([
      { name: Project.name, schema: ProjectSchema },
      { name: Issue.name, schema: IssueSchema }
    ])],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService]
})
export class ProjectsModule { }
