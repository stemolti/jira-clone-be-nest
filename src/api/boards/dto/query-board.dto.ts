import { IsOptional, IsInt, IsString, ArrayNotEmpty, ArrayUnique, IsNumber } from 'class-validator';

export class QueryBoardDTO {
  @IsOptional()
  @IsNumber()
  startAt: number;

  @IsOptional()
  @IsNumber()
  maxResults: number;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  projectKeyOrId: string;
}
