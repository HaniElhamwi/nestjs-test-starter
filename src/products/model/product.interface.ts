import { CategoryEntity } from 'src/category/model';
import { UserEntity } from 'src/user/model';

export interface IProductInterface {
  id: string;
  title: string;
  description?: string;
  image?: string;
  price: string;
  category: CategoryEntity;
  quantity?: string;
  CreatedAt?: Date;
  updatedAt?: Date;
  user?: UserEntity;
}
