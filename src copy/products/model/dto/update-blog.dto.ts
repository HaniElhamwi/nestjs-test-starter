import { IsOptional, IsString } from 'class-validator';
import { CategoryEntity } from 'src/category/model';

export class UpdatePostDto {
  @IsOptional()
  @IsOptional()
  id: string;

  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  @IsOptional()
  image?: string;

  @IsString()
  @IsOptional()
  price: string;

  @IsString()
  @IsOptional()
  category: CategoryEntity;

  @IsString()
  @IsOptional()
  quantity?: string;
}
