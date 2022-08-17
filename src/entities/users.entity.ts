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
  businessName: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  businessNumber: string;

  @Column({ nullable: true })
  address: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  IDCard: string;
}
