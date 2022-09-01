import { IsNotEmpty } from 'class-validator';
import { BaseEntity, Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '@interfaces/users.interface';

@Entity()
export class UserEntity extends BaseEntity implements User {
  @PrimaryColumn()
  @IsNotEmpty()
  uid: string;

  @Column()
  @IsNotEmpty()
  name: string;

  @Column()
  @IsNotEmpty()
  email: string;

  @Column()
  @IsNotEmpty()
  role: string;

  @Column({ type: 'uuid' })
  @IsNotEmpty()
  business_key: string;

  @Column({ nullable: true })
  id_card: string;

  @Column({ nullable: true })
  family_register: string;

  @Column({ nullable: true })
  collateral_doc: string;

  @Column({ nullable: true })
  tax_number_card: string;

  @Column()
  @CreateDateColumn()
  created_at: Date;

  @Column()
  @UpdateDateColumn()
  updated_at: Date;
}
