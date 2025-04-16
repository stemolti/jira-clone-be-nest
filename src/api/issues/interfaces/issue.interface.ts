import { Project } from '@api/projects/interfaces/project.interface';
import { Release } from '@api/releases/interfaces/release.interface';
import { Sprint } from '@api/sprints/interfaces/sprint.interface';
import { Types } from 'mongoose';

export interface Issue {
  issueId: Types.ObjectId | Issue | string;
  projectId: string;
  name: string;
  description?: string;
  sprintId: string;
}
