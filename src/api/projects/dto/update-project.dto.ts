import { IsOptional, IsString } from 'class-validator';

export class UpdateProjectDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}
