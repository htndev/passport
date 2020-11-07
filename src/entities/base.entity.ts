import { BaseEntity, UpdateDateColumn } from 'typeorm';

export class ExtendedBaseEntity extends BaseEntity {
  @UpdateDateColumn()
  updatedAt: Date;

  @UpdateDateColumn()
  createdAt: Date;
}
