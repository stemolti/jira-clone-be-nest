import { IsOptional, IsString } from "class-validator";

export class UpdateIssueDTO {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}