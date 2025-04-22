import { Types } from 'mongoose';

export interface IIssue {
  issueId: Types.ObjectId | IIssue | string;
  projectId: string;
  boardId?: string;
  summary: string;
  description: string;
  sprintId?: string;
}
