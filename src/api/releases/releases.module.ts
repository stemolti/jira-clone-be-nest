import { Module } from '@nestjs/common';
import { ReleasesService } from './releases.service';
import { ReleasesController } from './releases.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Release, ReleaseSchema } from './schemas/release.schema';
import { Issue, IssueSchema } from '@api/issues/schemas/issue.schema';

@Module({
  imports: [
    HttpModule,
    ConfigModule,
    MongooseModule.forFeature([
      { name: Release.name, schema: ReleaseSchema },
      { name: Issue.name, schema: IssueSchema }
    ])],
  controllers: [ReleasesController],
  providers: [ReleasesService],
  exports: [ReleasesService]
})
export class ReleasesModule { }
