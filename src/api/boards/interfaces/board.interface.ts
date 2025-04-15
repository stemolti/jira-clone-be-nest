import { Project } from "@api/projects/interfaces/project.interface";
import { Type } from "@nestjs/common";
import { Types } from "mongoose";

export interface Board {
  projectId: string;
  boardId: string;
  name: string;
}