import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsService } from './projects.service';
import { describe, beforeEach, it } from 'node:test';

describe('ProjectsService', () => {
  let service: ProjectsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectsService],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
