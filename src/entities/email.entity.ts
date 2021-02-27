import { EnhancedBaseEntity } from '@xbeat/server-toolkit';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from './user.entity';

@Entity({ name: 'email', synchronize: false })
export class Email extends EnhancedBaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar'
  })
  email: string;

  @Column({
    type: 'varchar'
  })
  type: string;

  @Column({
    type: 'timestamp',
    default: new Date()
  })
  sent?: Date;

  @Column({
    type: 'varchar'
  })
  uuid: string;

  @ManyToOne(() => User, (user) => user)
  user: User;

  @Column({
    type: 'boolean',
    default: true
  })
  isActive: boolean;
}
