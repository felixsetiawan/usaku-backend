import { Between, EntityRepository, Repository, UpdateResult } from 'typeorm';
import { createTransactionDto } from '@dtos/transactions.dto';
import { HttpException } from '@exceptions/HttpException';
import { Transaction } from '@interfaces/transaction.interface';
import { formatDate } from '@utils/util';
import { TransactionCategory, TransactionEntity } from '@/entities/transaction.entity';
import { isEmpty } from '@utils/util';

@EntityRepository()
class TransactionService extends Repository<TransactionEntity> {
  public async createTransaction(transactionData: createTransactionDto, uid: string): Promise<Transaction> {
    if (isEmpty(transactionData)) throw new HttpException(400, "You're not transactionData");

    const updateTransaction: Transaction = await TransactionEntity.create({ ...transactionData, uid }).save();

    return updateTransaction;
  }

  public async updateTransaction(transactionData: createTransactionDto, uid: string): Promise<Transaction> {
    if (isEmpty(transactionData)) throw new HttpException(400, "You're not transactionData");

    const updateTransaction: UpdateResult = await TransactionEntity.update({ id: transactionData.id, uid }, transactionData);
    console.log(updateTransaction);
    return null;
  }

  public async deleteTransaction(uid: string, id: number): Promise<Number> {
    const transactions: Transaction[] = await TransactionEntity.delete({ uid: uid, id: id });

    if (!Transactions) throw new HttpException(409, 'No transaction found with that id.');
    return transactions;
  }

  public async findAllTransaction(uid: string): Promise<Transaction[]> {
    const transactions: Transaction[] = await TransactionEntity.find();
    return transactions;
  }

  public async findCurrentTransaction(day: number, uid: string): Promise<Transaction[]> {
    const findTransactions: Transaction[] = await TransactionEntity.createQueryBuilder('transaction')
      .where(`transaction.uid = '${uid}' AND DATE_PART('day',transaction.datetime) = ${day}`)
      .getMany();

    if (!findTransactions) throw new HttpException(409, 'No transaction today.');

    return findTransactions;
  }

  public async findAllTransactionByUid(uid: string): Promise<Transaction[]> {
    const findTransactions: Transaction[] = await TransactionEntity.find({
      where: {
        uid,
      },
    });
    if (!findTransactions) throw new HttpException(409, 'No transaction found with that uid.');

    return findTransactions;
  }

  public async findAllTransactionByCategory(uid: string, category: TransactionCategory): Promise<Transaction[]> {
    // const findTransactions: Transaction[] = await TransactionEntity.query(`
    // SELECT category
    // FROM   transaction_entity
    // WHERE transaction_entity.uid = '${uid}' AND category = ${category}
    // `);
    const findTransactions: Transaction[] = await TransactionEntity.find({
      where: {
        uid: uid,
        category: category,
      },
    });
    console.log(findTransactions);

    if (!findTransactions) throw new HttpException(409, 'No transaction found within that range.');

    return findTransactions;
  }

  public async findTransactionsInRange(start: Date, end: Date, uid: string): Promise<Transaction[]> {
    const findTransactions: Transaction[] = await TransactionEntity.find({
      where: {
        uid: uid,
        datetime: Between(start, end),
      },
    });
    if (!findTransactions) throw new HttpException(409, 'No transaction found within that range.');

    return findTransactions;
  }

  public async findMonthlyTransaction(month: number, uid: string): Promise<Transaction[]> {
    const findTransactions: Transaction[] = await TransactionEntity.createQueryBuilder('transaction')
      .where(`transaction.uid = '${uid}' AND DATE_PART('month',transaction.datetime) = ${month}`)
      .getMany();
    if (!findTransactions) throw new HttpException(409, 'No transaction in that month.');

    return findTransactions;
  }

  public async findYearlyTransaction(year: number, uid: string): Promise<Transaction[]> {
    const findTransactions: Transaction[] = await TransactionEntity.createQueryBuilder('transaction')
      .where(`transaction.uid = '${uid}' AND DATE_PART('year',transaction.datetime) = ${year}`)
      .getMany();

    if (!findTransactions) throw new HttpException(409, 'No transaction in that year.');

    return findTransactions;
  }

  public async getRangedNettIncomeData(start: Date, end: Date, uid: string): Promise<Transaction[]> {
    const findTransactions: Transaction[] = await TransactionEntity.query(`SELECT to_char(datetime, 'YYYY-MM-DD') AS date, sum(amount) AS amount
    FROM   transaction_entity
    WHERE transaction_entity.uid = '${uid}' AND (datetime BETWEEN '${formatDate(start)}' AND '${formatDate(end)}')
    GROUP  BY date
    ORDER BY date;`);
    if (!findTransactions) throw new HttpException(409, 'No transaction found within that range.');

    return findTransactions;
  }

  public async getMonthlyNettIncomeData(month: number, uid: string): Promise<Transaction[]> {
    const findTransactions: Transaction[] = await TransactionEntity.query(`SELECT to_char(datetime, 'YYYY-MM-DD') AS date, sum(amount) AS amount
    FROM   transaction_entity
    WHERE transaction_entity.uid = '${uid}' AND DATE_PART('month',datetime) = ${month} 
    GROUP  BY date
    ORDER BY date;`);
    if (!findTransactions) throw new HttpException(409, 'No transaction found in that month.');

    return findTransactions;
  }

  public async getYearlyNettIncomeData(year: number, uid: string): Promise<Transaction[]> {
    const findTransactions: Transaction[] = await TransactionEntity.query(`SELECT to_char(datetime, 'YYYY-MM-DD') AS date, sum(amount) AS amount
    FROM   transaction_entity
    WHERE transaction_entity.uid = '${uid}' AND DATE_PART('year',datetime) = ${year}
    GROUP  BY date
    ORDER BY date;`);
    console.log(findTransactions);
    if (!findTransactions) throw new HttpException(409, 'No transaction found in that year.');

    return findTransactions;
  }

  public async getRangedSaleData(start: Date, end: Date, uid: string): Promise<Transaction[]> {
    const findTransactions: Transaction[] = await TransactionEntity.query(`SELECT to_char(datetime, 'YYYY-MM-DD') as date, COUNT(*) as sale_count
    FROM   transaction_entity
    WHERE transaction_entity.uid = '${uid}' AND (datetime BETWEEN '${formatDate(start)}' AND '${formatDate(end)}') 
    GROUP BY date
    ORDER BY date;`);
    if (!findTransactions) throw new HttpException(409, 'No transaction found within that range.');

    return findTransactions;
  }

  public async getMonthlySaleData(month: number, uid: string): Promise<Transaction[]> {
    const findTransactions: Transaction[] = await TransactionEntity.query(`SELECT to_char(datetime, 'YYYY-MM-DD') as date, COUNT(*) as sale_count
    FROM   transaction_entity
    WHERE transaction_entity.uid = '${uid}' AND DATE_PART('month',datetime) = ${month} 
    GROUP  BY date
    ORDER BY date;`);
    if (!findTransactions) throw new HttpException(409, 'No transaction found in that month.');

    return findTransactions;
  }

  public async getYearlySaleData(year: number, uid: string): Promise<Transaction[]> {
    const findTransactions: Transaction[] = await TransactionEntity.query(`SELECT to_char(datetime, 'YYYY-MM-DD') as date, COUNT(*) as sale_count
    FROM   transaction_entity
    WHERE transaction_entity.uid = '${uid}' AND DATE_PART('year',datetime) = ${year} 
    GROUP  BY date
    ORDER BY date;`);
    console.log(findTransactions);
    if (!findTransactions) throw new HttpException(409, 'No transaction found in that year.');

    return findTransactions;
  }

  public async getRangedContributionData(start: Date, end: Date, contributionType: string, uid: string): Promise<Transaction[]> {
    const findTransactions: Transaction[] = await TransactionEntity.query(`SELECT category, SUM(amount) as total
    FROM   transaction_entity
    WHERE transaction_entity.uid = '${uid}' AND (datetime BETWEEN '${formatDate(start)}' AND '${formatDate(end)}') AND ${
      contributionType === 'income' ? 'amount > 0' : 'amount < 0'
    }
    GROUP BY category;`);
    if (!findTransactions) throw new HttpException(409, 'No transaction found within that range.');

    return findTransactions;
  }

  public async getMonthlyContributionData(month: number, contributionType: string, uid: string): Promise<Transaction[]> {
    const findTransactions: Transaction[] = await TransactionEntity.query(`SELECT category, SUM(amount) as total
    FROM   transaction_entity
    WHERE transaction_entity.uid = '${uid}' AND DATE_PART('month',datetime) = ${month} AND ${
      contributionType === 'income' ? 'amount > 0' : 'amount < 0'
    }
    GROUP BY category;`);
    if (!findTransactions) throw new HttpException(409, 'No transaction found within that range.');

    return findTransactions;
  }

  public async getYearlyContributionData(year: number, contributionType: string, uid: string): Promise<Transaction[]> {
    const findTransactions: Transaction[] = await TransactionEntity.query(`SELECT category, SUM(amount) as total
    FROM   transaction_entity
    WHERE transaction_entity.uid = '${uid}' AND DATE_PART('year',datetime) = ${year} AND ${
      contributionType === 'income' ? 'amount > 0' : 'amount < 0'
    }
    GROUP BY category;`);
    console.log(findTransactions);
    if (!findTransactions) throw new HttpException(409, 'No transaction found within that range.');

    return findTransactions;
  }

  public async getPenjualanBersih(start: Date, end: Date, uid: string): Promise<Number> {
    const penjualanBersih: Number = await TransactionEntity.query(`SELECT sum(amount) as PENJUALAN_BERSIH
    FROM   transaction_entity
    WHERE uid = '${uid}' AND (datetime BETWEEN '${formatDate(start)}' AND '${formatDate(
      end,
    )}') AND category IN ('Penjualan','Retur Penjualan','Potongan Harga Penjualan') AND completion = 'Lunas';`);
    if (!penjualanBersih) throw new HttpException(409, 'No value');

    return penjualanBersih;
  }

  public async getHPP(start: Date, end: Date, uid: string): Promise<Number> {
    const HPPValue: Number = await TransactionEntity.query(`SELECT sum(- amount) as HPP
    from transaction_entity
    WHERE transaction_entity.uid = '${uid}' AND (datetime BETWEEN '${formatDate(start)}' AND '${formatDate(
      end,
    )}') AND completion = 'Lunas' AND category IN ('Beban Angkut Pembelian', 'Gaji Karyawan Produksi', 'Pembelian Bahan Baku','Potongan Pembelian Barang atau Jasa', 'Retur Pembelian Barang atau Jasa');`);
    if (!HPPValue) throw new HttpException(409, 'No value');

    return HPPValue;
  }

  public async getBiayaPenjualanUmumAdmOperasional(start: Date, end: Date, uid: string): Promise<Number> {
    const biaya: Number = await TransactionEntity.query(`SELECT - sum(amount) as biaya
    from transaction_entity
    WHERE transaction_entity.uid = '${uid}' AND (datetime BETWEEN '${formatDate(start)}' AND '${formatDate(
      end,
    )}') AND completion = 'Lunas' AND category IN ('Biaya Pengiriman Barang','Biaya Pemeliharaan Sistem', 'Biaya Pemasaran', 'Biaya Pemeliharaan Situs Web','Biaya Utilitas dan Peralatan Kantor','Biaya Pemeliharaan Sistem','Biaya Listrik','Biaya Gas','Biaya Air','Biaya Telepon');
    `);
    if (!biaya) throw new HttpException(409, 'No value');
    return biaya;
  }

  public async getBiayaKontrak(start: Date, end: Date, uid: string): Promise<Number> {
    const biaya: Number = await TransactionEntity.query(`SELECT - sum(amount) as biaya
    from transaction_entity
    WHERE transaction_entity.uid = '${uid}' AND (datetime BETWEEN '${formatDate(start)}' AND '${formatDate(
      end,
    )}') AND completion = 'Lunas' AND category = 'Biaya Sewa';
    `);
    if (!biaya) throw new HttpException(409, 'No value');
    return biaya;
  }

  public async getBiayaLainnya(start: Date, end: Date, uid: string): Promise<Number> {
    const biaya: Number = await TransactionEntity.query(`SELECT - sum(amount) as biaya
    from transaction_entity
    WHERE transaction_entity.uid = '${uid}' AND (datetime BETWEEN '${formatDate(start)}' AND '${formatDate(
      end,
    )}') AND completion = 'Lunas' AND category = 'Pengeluaran Lainnya';
    `);
    if (!biaya) throw new HttpException(409, 'No value');
    return biaya;
  }

  public async getPendapatanLainnya(start: Date, end: Date, uid: string): Promise<Number> {
    const pendapatan: Number = await TransactionEntity.query(`SELECT sum(amount) as pendapatan
      from transaction_entity
      WHERE transaction_entity.uid = '${uid}' AND (datetime BETWEEN '${formatDate(start)}' AND '${formatDate(
      end,
    )}') AND completion = 'Lunas' AND category = 'Pendapatan Lainnya';
      `);
    if (!pendapatan) throw new HttpException(409, 'No value');
    return pendapatan;
  }

  public async getPiutang(start: Date, end: Date, uid: string): Promise<Number> {
    const piutang: Number = await TransactionEntity.query(`SELECT sum(amount) as piutang
      from transaction_entity
      WHERE transaction_entity.uid = '${uid}' AND (datetime BETWEEN '${formatDate(start)}' AND '${formatDate(
      end,
    )}') AND completion = 'Belum Lunas' AND amount > 0;
      `);
    if (!piutang) throw new HttpException(409, 'No value');
    return piutang;
  }

  public async getHutang(start: Date, end: Date, uid: string): Promise<Number> {
    const hutang: Number = await TransactionEntity.query(`SELECT - sum(amount) as hutang
      from transaction_entity
      WHERE transaction_entity.uid = '${uid}' AND (datetime BETWEEN '${formatDate(start)}' AND '${formatDate(
      end,
    )}') AND completion = 'Belum Lunas' AND amount < 0;
      `);
    if (!hutang) throw new HttpException(409, 'No value');
    return hutang;
  }

  public async getModal(start: Date, end: Date, uid: string): Promise<Number> {
    const modal: Number = await TransactionEntity.query(`SELECT sum(amount) as modal
      from transaction_entity
      WHERE transaction_entity.uid = '${uid}' AND (datetime BETWEEN '${formatDate(start)}' AND '${formatDate(
      end,
    )}') AND completion = 'Lunas' AND category = 'Penambahan Modal';
      `);
    if (!modal) throw new HttpException(409, 'No value');
    return modal;
  }

  public async getLabaDitahan(start: Date, end: Date, uid: string): Promise<Number> {
    const labaDitahan: Number = await TransactionEntity.query(`SELECT - sum(amount) as laba_ditahan
      from transaction_entity
      WHERE transaction_entity.uid = '${uid}' AND (datetime BETWEEN '${formatDate(start)}' AND '${formatDate(
      end,
    )}') AND completion = 'Lunas' AND category = 'Laba Ditahan';
      `);
    if (!labaDitahan) throw new HttpException(409, 'No value');
    return labaDitahan;
  }

  public async getPrive(start: Date, end: Date, uid: string): Promise<Number> {
    const prive: Number = await TransactionEntity.query(`SELECT - sum(amount) as prive
      from transaction_entity
      WHERE transaction_entity.uid = '${uid}' AND (datetime BETWEEN '${formatDate(start)}' AND '${formatDate(
      end,
    )}') AND completion = 'Lunas' AND category = 'Pribadi / Prive';
      `);
    if (!prive) throw new HttpException(409, 'No value');
    return prive;
  }
}

export default TransactionService;
