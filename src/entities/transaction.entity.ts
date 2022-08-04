import { IsNotEmpty } from 'class-validator';
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Transaction } from '@interfaces/transaction.interface';

export enum TransactionCategory {
  PERALATAN = 'peralatan',
  LISTRIK = 'listrik',
  AIR = 'air',
  MODAL_USAHA = 'keperluan usaha',
  UTANG_USAHA = 'utang usaha',
  PIUTANG_USAHA = 'piutang usaha',
  INVESTASI = 'investasi',
  BEBAN_GAJI = 'gaji',
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
