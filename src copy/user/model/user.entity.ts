import {
  BeforeInsert,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserRole } from './user.interface';
import { ProductEntity } from 'src/products/model';
import { CategoryEntity } from 'src/category/model';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  companyName: string;

  @Column()
  companyTaxNumber: string;

  @Column({ unique: true, nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  website: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Column({ default: false })
  verified: boolean;

  @Column({ default: false })
  isDisabled: boolean;

  @OneToMany(() => ProductEntity, (ProductEntity) => ProductEntity.user)
  products: ProductEntity;

  @OneToMany(() => CategoryEntity, (cat) => cat.user)
  categories: CategoryEntity;

  @BeforeInsert()
  emailToLowerCase() {
    this.email = this.email.toLowerCase();
  }

  @Column({ nullable: true })
  resetToken: string;

  @Column({ nullable: true })
  resetTokenExpiration: Date;

  @Column({ default: '', length: 2500, nullable: true })
  refreshToken: string;

  @ManyToMany(() => ProductEntity, (product) => product.favoritedBy)
  @JoinTable()
  favorites: ProductEntity[];
}
