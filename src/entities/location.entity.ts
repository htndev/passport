import { ExtendedBaseEntity } from './base.entity';
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'locations' })
export class Location extends ExtendedBaseEntity {
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

  @OneToMany(() => User, (user) => user.location, { eager: true })
  users: User[];
}
