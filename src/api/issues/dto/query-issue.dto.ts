import { IsNumber, IsOptional, IsString } from "class-validator";

export class QueryIssueDTO {
  @IsOptional()
  @IsNumber()
  startAt?: number;

  @IsOptional()
  @IsNumber()
  maxResults?: number;

  @IsOptional()
  @IsString()
  jql?: string;
}