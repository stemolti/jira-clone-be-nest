import { Project } from "@api/projects/interfaces/project.interface";
import { Type } from "@nestjs/common";
import { Types } from "mongoose";

export interface Board {
  boardId: string;
  projectId?: string;
  name: string;
}