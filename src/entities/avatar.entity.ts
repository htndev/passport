import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { EnhancedBaseEntity } from './enhanced-base.entity';
import { User } from './user.entity';

@Entity({ name: 'avatars' })
export class Avatar extends EnhancedBaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.avatar, { eager: false })
  @Column({
    type: 'int'
  })
  owner: number;

  @Column({
    type: 'varchar'
  })
  avatar: string;
}
