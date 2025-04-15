import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBoardDTO {

  @IsString()
  @IsNotEmpty()
  name: string;
}