import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { EnhancedBaseEntity } from './enhanced-base.entity';

@Entity({ name: 'user_email_confirmation' })
export class UserEmailConfirmation extends EnhancedBaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    unique: true
  })
  email: string;

  @Column({
    type: 'timestamp',
    default: new Date()
  })
  send: Date;
}
