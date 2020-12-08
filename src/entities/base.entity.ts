import { BaseEntity, UpdateDateColumn, CreateDateColumn } from 'typeorm';

export class ExtendedBaseEntity extends BaseEntity {
  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
