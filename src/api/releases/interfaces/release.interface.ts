import { Project } from "@api/projects/interfaces/project.interface";
import { Type } from "@nestjs/common";
import { Types } from "mongoose";

export interface Release {
  releaseId: string;
  projectId: string;
  name: string;
  status: string;
  releaseDate: Date;
  description?: string;
}
