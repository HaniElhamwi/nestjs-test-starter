import { IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsOptional()
  id: string;

  @IsString()
  title: string;

  @IsOptional()
  description: string;
}
