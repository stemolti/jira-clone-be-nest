import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheModule } from '@nestjs/cache-manager';
import { ProjectsModule } from '@api/projects/projects.module';
import { UserProjectsModule } from '@api/user-projects/user-projects.module';
import { UsersModule } from '@api/users/users.module';
import * as redisStore  from 'cache-manager-redis-store';
import { ConfigModule } from '@nestjs/config';
import { IssuesModule } from '@api/issues/issues.module';
import { SprintsModule } from '@api/sprints/sprints.module';
import { BoardsModule } from '@api/boards/boards.module';
import { CommentsModule } from '@api/comments/comments.module';
import { ReleasesModule } from '@api/releases/releases.module';
import { BoardsIssuesModule } from '@api/boards-issues/boards-issues.module';
import { IssuesSprintsModule } from '@api/issues-sprints/issues-sprints.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/jira-test'),
    ConfigModule.forRoot(),
    CacheModule.register({
      store: redisStore,
      host: 'localhost',
      port: 6379,
      ttl: 600,
      isGlobal: true,
    }),	
    UsersModule,
    ProjectsModule,
    UserProjectsModule,
    IssuesModule,
    BoardsModule,
    BoardsIssuesModule,
    CommentsModule,
    ReleasesModule,
    SprintsModule,
    IssuesSprintsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
