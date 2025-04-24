import { IsOptional, IsString, IsNumber } from 'class-validator';

export class QueryProjectDTO {
  @IsOptional()
  @IsNumber()
  startAt?: number;

  @IsOptional()
  @IsNumber()
  maxResults?: number;

  @IsOptional()
  @IsString()
  query?: string;
}
