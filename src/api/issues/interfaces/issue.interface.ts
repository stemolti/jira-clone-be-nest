import { Types } from 'mongoose';

export interface IIssue {
  issueId: Types.ObjectId | IIssue | string;
  projectId: string;
  releaseId?: string;
  boardId?: string;
  summary: string;
  description: string;
  status: string;
  sprintId?: string;
}
