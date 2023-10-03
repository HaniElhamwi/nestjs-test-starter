import { IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @IsOptional()
  id: string;

  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description: string;
}
