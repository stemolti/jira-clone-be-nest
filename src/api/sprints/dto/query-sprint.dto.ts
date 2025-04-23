import { IsInt, IsOptional, IsString } from "class-validator";

export class QuerySprintDTO {
  @IsOptional()
  @IsInt()
  startAt?: number;

  @IsOptional()
  @IsInt()
  maxResults?: number;

  @IsOptional()
  @IsString()
  state?: any;
}