import { compare } from 'bcrypt';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { EnhancedBaseEntity } from './enhanced-base.entity';
import { Location } from './location.entity';

@Entity({ name: 'users' })
export class User extends EnhancedBaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 150,
    unique: true
  })
  email: string;

  @Column({
    unique: true,
    type: 'varchar',
    length: 26
  })
  username: string;

  @Column({
    type: 'varchar',
    length: 256
  })
  password: string;

  @Column({
    type: 'varchar',
    nullable: true
  })
  avatar: string;

  @ManyToOne(() => Location, (location) => location.users, { eager: false })
  @JoinColumn()
  location: Location;

  @Column()
  locationId: number;

  async comparePasswords(password: string): Promise<boolean> {
    return compare(password, this.password);
  }
}
