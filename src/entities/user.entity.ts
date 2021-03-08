import { UserPreferences } from './user-preferences.entity';
import { EnhancedBaseEntity } from '@xbeat/server-toolkit';
import { compare } from 'bcrypt';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Email } from './email.entity';
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
  @Index()
  email: string;

  @Column({
    unique: true,
    type: 'varchar',
    length: 26
  })
  @Index()
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

  @ManyToOne(() => Location, (location) => location.users, { eager: true })
  @JoinColumn()
  location: Location;

  @Column()
  locationId: number;

  @Column({
    type: 'boolean',
    default: false
  })
  isEmailConfirmed: boolean;

  @OneToMany(() => Email, (email) => email.user)
  emails: Email[];

  @JoinColumn()
  @OneToOne(() => UserPreferences, { eager: false })
  preferences: UserPreferences;

  @Column()
  preferencesId: number;

  async comparePasswords(password: string): Promise<boolean> {
    return compare(password, this.password);
  }
}
