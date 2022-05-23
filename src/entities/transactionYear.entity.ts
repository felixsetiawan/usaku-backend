import { IsNotEmpty } from 'class-validator';
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { TransactionYear } from '@interfaces/transactionYear.interface';

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

  @Column()
  year: number;
}
