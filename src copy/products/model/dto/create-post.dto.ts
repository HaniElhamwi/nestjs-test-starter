import { IsOptional, IsString } from 'class-validator';
import { CategoryEntity } from 'src/category/model';

export class CreatePostDto {
  @IsOptional()
  id: string;

  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  price: string;

  @IsString()
  category: CategoryEntity;

  @IsString()
  quantity?: string;
}
