import { IsInt, IsOptional, IsString } from "class-validator";

export class QueryReleaseDTO {
  @IsOptional()
  @IsInt()
  startAt: number;

  @IsOptional()
  @IsInt()
  maxResults: number;

  @IsOptional()
  @IsString()
  orderBy: string;

  @IsOptional()
  @IsString()
  query: string;

  @IsOptional()
  @IsString()
  released: boolean;

  @IsOptional()
  @IsString()
  jql: string;
}
