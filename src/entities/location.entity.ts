import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { EnhancedBaseEntity } from './enhanced-base.entity';
import { User } from './user.entity';

@Entity({ name: 'locations' })
export class Location extends EnhancedBaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar'
  })
  country: string;

  @Column({
    type: 'varchar'
  })
  code: string;

  @Column({
    type: 'varchar'
  })
  region: string;

  @Column({
    type: 'varchar',
    unique: true
  })
  city: string;

  @OneToMany(() => User, (user) => user.location, { eager: false })
  users: User[];
}
