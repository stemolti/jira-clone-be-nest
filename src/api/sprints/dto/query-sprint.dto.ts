import { IsInt, IsOptional } from "class-validator";

export class QuerySprintDTO {
  @IsOptional()
  @IsInt()
  startAt?: number;

  @IsOptional()
  @IsInt()
  maxResults?: number;

  @IsOptional()
  state?: any
}