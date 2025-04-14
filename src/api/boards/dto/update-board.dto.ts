import { IsOptional, IsString } from 'class-validator';

export class UpdateBoardDTO {
  @IsString()
  @IsOptional()
  name: string;
}
