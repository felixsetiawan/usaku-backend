import { IsNotEmpty } from 'class-validator';
import { BaseEntity, Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Employee } from '@interfaces/employee.interface';

@Entity()
export class EmployeeEntity extends BaseEntity implements Employee {
  @PrimaryColumn()
  @IsNotEmpty()
  business_key: string;

  @PrimaryColumn()
  @IsNotEmpty()
  uid: string;

  @Column()
  @IsNotEmpty()
  role: string;

  @Column()
  @IsNotEmpty()
  business_name: string;

  @Column()
  @IsNotEmpty()
  name: string;

  @Column()
  @IsNotEmpty()
  email: string;

  @Column()
  @CreateDateColumn()
  created_at: Date;

  @Column()
  @UpdateDateColumn()
  updated_at: Date;
}
