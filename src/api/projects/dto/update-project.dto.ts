import { IsOptional, IsString } from 'class-validator';

export class UpdateProjectDTO {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}
