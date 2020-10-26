import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 150,
    unique: true,
  })
  email: string;

  @Column({
    unique: true,
    type: 'varchar',
    length: 26,
  })
  username: string;

  @Column({
    type: 'varchar',
    length: 256,
  })
  password: string;

  @Column({
    type: 'int',
  })
  countryCode: number;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;
}
