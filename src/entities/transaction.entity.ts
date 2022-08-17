import { IsNotEmpty } from 'class-validator';
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Transaction } from '@interfaces/transaction.interface';

export enum TransactionCategory {
  PERALATAN = 'peralatan',
  LISTRIK = 'listrik',
  AIR = 'air',
  MODAL = 'modal',
  UTANG_USAHA = 'utang_usaha',
  PIUTANG_USAHA = 'piutang_usaha',
  INVESTASI = 'investasi',
  GAJI = 'gaji',
  PENJUALAN = 'penjualan',
  LAINNYA = 'lainnya',
}

@Entity()
export class TransactionEntity extends BaseEntity implements Transaction {
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
  description: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  @IsNotEmpty()
  datetime: Date;

  @Column()
  proof: string;
}
