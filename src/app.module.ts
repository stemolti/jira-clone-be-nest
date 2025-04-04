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

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/jira-test'),
    ConfigModule.forRoot(),
    CacheModule.register({
      store: redisStore,
      host: 'localhost',
      port: 6379,
      ttl: 600
    }),	
    UsersModule,
    ProjectsModule,
    UserProjectsModule
    // IssuesModule,
    // CommentsModule,
    // AuthModule,
    // ReleasesModule,
    // SprintsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
