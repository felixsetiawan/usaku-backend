import { IsNotEmpty } from 'class-validator';
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Transaction } from '@interfaces/transaction.interface';

export enum TransactionCategory {
  //Pengeluaran
  BEBAN_ANGKUT_PEMBELIAN = 'Beban Angkut Pembelian',
  PEMBELIAN_BAHAN_BAKU = 'Pembelian Bahan Baku',
  GAJI_KARYAWAN_PRODUKSI = 'Gaji Karyawan Produksi',
  BIAYA_PENGIRIMAN_BARANG = 'Biaya Pengiriman Barang',
  BIAYA_PEMASARAN = 'Biaya Pemasaran',
  BIAYA_PEMELIHARAAN_SITUS_WEB = 'Biaya Pemeliharaan Situs Web',
  BIAYA_UTILITAS_PERALATAN_KANTOR = 'Biaya Utilitas dan Peralatan Kantor',
  BIAYA_PEMELIHARAAN_SISTEM = 'Biaya Pemeliharaan Sistem',
  BIAYA_LISTRIK = 'Biaya Listrik',
  BIAYA_GAS = 'Biaya Gas',
  BIAYA_AIR = 'Biaya Air',
  BIAYA_LIBURAN = 'Biaya Liburan',
  BIAYA_TELEPON = 'Biaya Telepon',
  GAJI_KARYAWAN_NON_PRODUKSI = 'Gaji Karyawan Non Produksi',
  PRIVE = 'Pribadi / Prive',
  LABA_DITAHAN = 'Laba Ditahan',
  PENGELUARAN_LAINNYA = 'Pengeluaran Lainnya',
  //Pemasukan
  PENJUALAN = 'Penjualan',
  POTONGAN_PEMBELIAN_BARANG_JASA = 'Potongan Pembelian Barang atau Jasa',
  RETUR_PEMBELIAN_BARANG_JASA = 'Retur Pembelian Barang atau Jasa',
  PENAMBAHAN_MODAL = 'Penambahan Modal',
  PEMASUKAN_LAINNYA = 'Pemasukan Lainnya',
}

export enum TransactionCompletion {
  LUNAS = 'Lunas',
  BELUM_LUNAS = 'Belum Lunas',
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
  })
  category: TransactionCategory;

  @Column({
    type: 'enum',
    enum: TransactionCompletion,
  })
  completion: TransactionCompletion;

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
