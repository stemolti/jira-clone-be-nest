import { Project } from "@api/projects/interfaces/project.interface";
import { Type } from "@nestjs/common";
import { Types } from "mongoose";

export interface Board {
  projectId: Types.ObjectId | Project | string;
  boardId: Types.ObjectId | Board | string;
  name: string;
}