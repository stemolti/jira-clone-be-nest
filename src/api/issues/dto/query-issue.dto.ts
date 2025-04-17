import { IsInt, IsOptional, IsString } from "class-validator";

export class QueryIssueDTO {
  @IsOptional()
  @IsInt()
  startAt?: number;

  @IsOptional()
  @IsInt()
  maxResults?: number;

  @IsOptional()
  @IsString()
  jql?: string;
}