import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateIssueDTO {

  @IsString()
  boardId: string;

  @IsString()
  projectId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}