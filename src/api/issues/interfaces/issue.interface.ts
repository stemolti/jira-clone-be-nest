import { Types } from 'mongoose';

export interface IIssue {
  issueId: Types.ObjectId | IIssue | string;
  projectId: string;
  boardId?: string;
  name: string;
  description: string;
  sprintId?: string;
}
