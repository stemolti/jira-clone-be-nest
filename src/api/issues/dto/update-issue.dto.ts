import { IsOptional, IsString } from "class-validator";

export class UpdateIssueDTO {
  @IsString()
  summary: string;

  @IsString()
  @IsOptional()
  description?: string;
}