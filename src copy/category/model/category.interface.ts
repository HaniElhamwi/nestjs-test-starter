import { ProductEntity } from 'src/products/model';

export interface ICategory {
  id?: string;
  title: string;
  description?: string;
  products?: ProductEntity[];
}
