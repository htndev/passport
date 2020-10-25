import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn
} from 'typeorm';

@Entity({name: 'locations'})
export class Location extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar'
  })
  country: string;

  @Column({
    type: 'varchar'
  })
  code: string;

  @Column({
    type: 'varchar'
  })
  region: string;

  @Column({
    type: 'varchar'
  })
  city: string;

  @Column({
    type: 'timestamp',
  })
  updatedAt: Date;

  @Column({
    type: 'timestamp',
  })
  createdAt: Date;

  @BeforeInsert()
  updateCreationDate(): void {
    this.createdAt = new Date();
  }

  @BeforeInsert()
  @BeforeUpdate()
  updateUpdatedAt(): void{
    this.updatedAt = new Date();
  }
}
