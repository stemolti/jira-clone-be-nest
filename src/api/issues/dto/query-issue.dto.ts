import { IsInt, IsOptional } from "class-validator";

export class QueryIssueDTO {
  @IsOptional()
  @IsInt()
  startAt?: number;

  @IsOptional()
  @IsInt()
  maxResults?: number;
}