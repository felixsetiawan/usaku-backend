import { IsNotEmpty } from 'class-validator';
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { TransactionMonth } from '@interfaces/transactionMonth.interface';

@Entity()
export class TransactionMonthEntity extends BaseEntity implements TransactionMonth {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  uid: string;

  @Column()
  @IsNotEmpty()
  amount: number;

  @Column()
  month: number;

  @Column()
  year: number;
}
