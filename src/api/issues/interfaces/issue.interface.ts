import { Project } from '@api/projects/interfaces/project.interface';
import { Release } from '@api/releases/interfaces/release.interface';
import { Sprint } from '@api/sprints/interfaces/sprint.interface';
import { Types } from 'mongoose';

export interface Issue {
  projectId: string;
  releaseId: string;
  issueId: Types.ObjectId | Issue | string;
  name: string;
  description?: string;
  activeSprintId?: Types.ObjectId | Sprint;
}
