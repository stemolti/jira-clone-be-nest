import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBoardDTO {
  @IsString()
  boardId: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}