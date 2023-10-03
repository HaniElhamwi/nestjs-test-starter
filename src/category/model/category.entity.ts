import { ProductEntity } from 'src/products/model';
import { UserEntity } from 'src/user/model';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ unique: true })
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  image: string;

  @OneToMany(() => ProductEntity, (prod) => prod.category)
  products: ProductEntity[];

  @ManyToOne(() => UserEntity, (user) => user.categories)
  user: UserEntity;
}
