import { IsOptional, IsInt, IsString, ArrayNotEmpty, ArrayUnique } from 'class-validator';

export class QueryBoardDTO {
  @IsOptional()
  @IsInt()
  startAt: number;

  @IsOptional()
  @IsInt()
  maxResults: number;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  projectKeyOrId: string;
}
