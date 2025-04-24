import { IsOptional, IsInt, IsString, IsArray, ArrayNotEmpty, ArrayUnique, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryProjectDTO {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  startAt?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  maxResults?: number;

  @IsOptional()
  @IsString()
  query?: string;
}
