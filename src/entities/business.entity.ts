import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { Business } from '@interfaces/business.interface';

@Entity()
export class BusinessEntity extends BaseEntity implements Business {
  @PrimaryColumn({ type: 'uuid' })
  business_key: string;

  @Column()
  business_name: string;

  @Column()
  business_address: string;

  @Column()
  cash: number;

  @Column()
  owner: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}
