import { ProfileType } from '../common/constants/profile-type.constant';
import { User } from './user.entity';
import { EnhancedBaseEntity } from '@xbeat/server-toolkit';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Language } from '../common/constants/languages.constant';

@Entity({ name: 'user_preferences' })
export class UserPreferences extends EnhancedBaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    default: Language.EN
  })
  language: Language;

  @Column({
    enum: ProfileType,
    default: ProfileType.Public
  })
  profileType: ProfileType;

  @OneToOne(() => User, (user) => user.preferences, { eager: false })
  user: User;
}
