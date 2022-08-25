import { IsNotEmpty } from 'class-validator';
import { BaseEntity, Entity, Generated, PrimaryColumn, Column, Unique, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '@interfaces/users.interface';

@Entity()
export class UserEntity extends BaseEntity implements User {
  @PrimaryColumn()
  @IsNotEmpty()
  uid: string;

  @Column()
  @IsNotEmpty()
  name: string;

  @Column({ nullable: true })
  business_name: string;

  @Column({ nullable: true })
  phone_number: string;

  @Column({ nullable: true })
  business_number: string;

  @Column({ nullable: true })
  address: string;

  @Column()
  @CreateDateColumn()
  created_at: Date;

  @Column()
  @UpdateDateColumn()
  updated_at: Date;

  @Column({ nullable: true })
  id_card_number: string;

  @Column({ nullable: true })
  organization_key: string;
}
