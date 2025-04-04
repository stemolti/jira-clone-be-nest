import { CacheInterceptor } from '@nestjs/cache-manager';
import { Controller, UseInterceptors } from '@nestjs/common';
import { ProjectsService } from './projects.service';

@Controller('projects')
@UseInterceptors(CacheInterceptor)
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}
}
