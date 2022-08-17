import { IsNotEmpty } from 'class-validator';
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { TransactionMonth } from '@interfaces/transactionMonth.interface';
import { TransactionCategory } from './transaction.entity';

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

  @Column({
    type: 'enum',
    enum: TransactionCategory,
    default: TransactionCategory.LAINNYA,
  })
  category: TransactionCategory;

  @Column()
  month: number;

  @Column()
  year: number;
}
