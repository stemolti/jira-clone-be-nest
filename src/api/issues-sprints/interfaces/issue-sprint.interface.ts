import { Issue } from "@api/issues/interfaces/issue.interface";
import { Sprint } from "@api/sprints/interfaces/sprint.interface";
import { Types } from "mongoose";


export interface IssueSprint  {
  issueId: string;
  sprintId: string;
}
