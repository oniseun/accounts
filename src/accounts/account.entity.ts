import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum Gender {
  Male = 'M',
  Female = 'F',
  Diverse = 'D',
  None = 'N',
}

@Entity()
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 25, name: 'first_name' })
  firstName: string;

  @Column({ length: 25, name: 'last_name' })
  lastName: string;

  @Column({ length: 35, name: 'email_address', unique: true })
  email: string;

  @Column({ length: 15, name: 'phone_number', unique: true })
  phone: string;

  @Column({
    enum: Gender,
    default: 'N',
  })
  gender: Gender;

  @Column({ type: 'text', nullable: true })
  address: string;

  @CreateDateColumn({
    name: 'date_created',
    default: () => 'CURRENT_TIMESTAMP',
  })
  dateCreated: Date;

  @UpdateDateColumn({
    name: 'date_updated',
    default: () => 'CURRENT_TIMESTAMP',
  })
  dateUpdated: Date;
}
