import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class SearchIssueDTO {
  @IsString()
  @IsNotEmpty()
  jql: string;

  @IsOptional()
  @IsInt()
  maxResults?: number;
}