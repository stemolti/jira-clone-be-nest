import { IsOptional, IsString } from "class-validator";

export class UpdateIssueDTO {
  @IsString()
  @IsOptional()
  summary: string;

  @IsString()
  @IsOptional()
  description?: string;
}