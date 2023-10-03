import { IsOptional, IsString } from 'class-validator';

export class CreateNewsDto {
  @IsString()
  @IsOptional()
  id: string;

  @IsString()
  headTitle: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  @IsOptional()
  image: string;

  @IsString()
  @IsOptional()
  CreatedAt: Date;

  @IsString()
  @IsOptional()
  updatedAt: Date;
}
