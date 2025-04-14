import { IsOptional, IsInt, IsString, IsArray, ArrayNotEmpty, ArrayUnique } from 'class-validator';

export class QueryBoardDTO {
  @IsOptional()
  @IsInt()
  startAt?: number;

  @IsOptional()
  @IsInt()
  maxResults?: number;

  @IsOptional()
  @IsString()
  orderBy?: string;

  @IsOptional()
  @IsString()
  projectKeyOrId?: string;
}
