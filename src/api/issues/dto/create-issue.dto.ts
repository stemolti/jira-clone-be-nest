import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateIssueDTO {

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}