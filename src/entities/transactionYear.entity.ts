import { IsNotEmpty } from 'class-validator';
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { TransactionYear } from '@interfaces/transactionYear.interface';
import { TransactionCategory } from './transaction.entity';

@Entity()
export class TransactionYearEntity extends BaseEntity implements TransactionYear {
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
  })
  category: TransactionCategory;

  @Column()
  year: number;
}
