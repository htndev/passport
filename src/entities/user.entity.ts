import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn
} from 'typeorm';

@Entity({name: 'users'})
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 150,
    unique: true,
  })
  email: string;

  @Column({
    unique: true,
    type: 'varchar',
    length: 26,
  })
  username: string;

  @Column({
    type: 'varchar',
    length: 256,
  })
  password: string;

  @Column({
    type: 'int',
  })
  countryCode: number;

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
