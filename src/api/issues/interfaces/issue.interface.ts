import { Project } from '@api/projects/interfaces/project.interface';
import { Release } from '@api/releases/interfaces/release.interface';
import { Sprint } from '@api/sprints/interfaces/sprint.interface';
import { Types } from 'mongoose';

export interface Issue {
  projectId: Types.ObjectId | Project;
  releaseId: Types.ObjectId | Release;
  issueId: Types.ObjectId | Issue;
  name: string;
  description?: string;
  activeSprintId?: Types.ObjectId | Sprint;
}
