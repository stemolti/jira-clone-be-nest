import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Sprint, SprintSchema } from './schemas/sprint.schema';
import { SprintsController } from './sprints.controller';
import { SprintsService } from './sprints.service';
import { Issue, IssueSchema } from '@api/issues/schemas/issue.schema';

@Module({
  imports: [
    HttpModule,
    ConfigModule,
    MongooseModule.forFeature([
      {name: Sprint.name, schema: SprintSchema },
      {name: Issue.name, schema: IssueSchema }

    ])
  ],
  controllers: [SprintsController],
  providers: [SprintsService],
  exports: [SprintsService],
})
export class SprintsModule {}