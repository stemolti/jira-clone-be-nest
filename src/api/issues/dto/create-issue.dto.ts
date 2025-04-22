import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateIssueDTO {

  @IsString()
  boardId: string;

  @IsString()
  projectId: string;

  @IsString()
  @IsNotEmpty()
  summary: string;

  @IsString()
  @IsOptional()
  description?: string;
}