import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class NewsEntity {
  @PrimaryGeneratedColumn()
  id?: string;

  @Column({ unique: true })
  headTitle: string;

  @Column({ unique: true })
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  image: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  CreatedAt?: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt?: Date;
}
