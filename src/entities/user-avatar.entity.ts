import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { EnhancedBaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity({ name: 'user_avatars' })
export class UserAvatar extends EnhancedBaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.avatar, { eager: false })
  @Column({
    type: 'varchar'
  })
  owner: number;

  @Column({
    type: 'varchar'
  })
  avatar: string;

  @Column({
    type: 'boolean',
    default: true
  })
  isActive: boolean;
}
