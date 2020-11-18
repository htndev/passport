import { compare } from 'bcrypt';
import { Location } from './location.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ExtendedBaseEntity } from './base.entity';

@Entity({ name: 'users' })
export class User extends ExtendedBaseEntity {
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
    type: 'int'
  })
  countryCode: number;

  async comparePasswords(password: string): Promise<boolean> {
    return compare(password, this.password);
  }

  @ManyToOne(() => Location, (location) => location.users, { eager: false })
  location: Location;
}
