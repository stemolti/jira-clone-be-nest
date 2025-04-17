import { Types } from 'mongoose';

export interface Issue {
  issueId: Types.ObjectId | Issue | string;
  projectId: string;
  name: string;
  description?: string;
  sprintId: string;
}
