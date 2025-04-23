import { IsOptional, IsInt, IsString, IsArray, ArrayNotEmpty, ArrayUnique } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryProjectDTO {
  @IsOptional()
  @IsInt()
  startAt?: number;

  @IsOptional()
  @IsInt()
  maxResults?: number;

  @IsOptional()
  @IsString()
  query?: string;
}
