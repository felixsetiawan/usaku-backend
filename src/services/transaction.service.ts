import { Between, EntityRepository, Repository, UpdateResult } from 'typeorm';
import { createTransactionDto } from '@dtos/transactions.dto';
import { HttpException } from '@exceptions/HttpException';
import { Transaction } from '@interfaces/transaction.interface';
import { formatDate } from '@utils/util';
import { TransactionCategory, TransactionEntity, TransactionCompletion } from '@/entities/transaction.entity';
import { isEmpty } from '@utils/util';

@EntityRepository()
class TransactionService extends Repository<TransactionEntity> {
  public async createTransaction(transactionData: createTransactionDto, business_key: string): Promise<Transaction> {
    if (isEmpty(transactionData)) throw new HttpException(400, "You're not transactionData");

    const updateTransaction: Transaction = await TransactionEntity.create({ ...transactionData, business_key }).save();

    return updateTransaction;
  }

  public async updateTransaction(transactionData: createTransactionDto, business_key: string): Promise<Transaction> {
    if (isEmpty(transactionData)) throw new HttpException(400, "You're not transactionData");

    const updateTransaction: UpdateResult = await TransactionEntity.update({ id: transactionData.id, business_key }, transactionData);
    console.log(updateTransaction);
    return null;
  }

  public async deleteTransaction(business_key: string, id: number): Promise<Number> {
    const transactions: Transaction[] = await TransactionEntity.delete({
      business_key,
      id,
    });

    if (!transactions) throw new HttpException(409, 'No transaction found with that id.');
    return transactions;
  }

  public async findAllTransaction(business_key: string): Promise<Transaction[]> {
    const transactions: Transaction[] = await TransactionEntity.find();
    return transactions;
  }

  public async findAllTransactionByUid(business_key: string): Promise<Transaction[]> {
    const findTransactions: Transaction[] = await TransactionEntity.find({
      where: {
        business_key: business_key,
      },
    });
    if (!findTransactions) throw new HttpException(409, 'No transaction found with that uid.');

    return findTransactions;
  }

  public async findMonthlyTransaction(month: number, year: number, business_key: string): Promise<Transaction[]> {
    const findTransactions: Transaction[] = await TransactionEntity.createQueryBuilder('transaction')
      .where(
        `transaction.business_key = '${business_key}' AND DATE_PART('month',transaction.datetime) = ${month} 
      AND DATE_PART('year',transaction.datetime) = ${year}`,
      )
      .orderBy('transaction.datetime', 'DESC')
      .getMany();
    if (!findTransactions) throw new HttpException(409, 'No transaction in that month.');

    return findTransactions;
  }

  public async findAllTransactionByCompletion(business_key: string, category: string): Promise<Transaction[]> {
    console.log(category);
    const findTransactions: Transaction[] = await TransactionEntity.createQueryBuilder('transaction')
      .where(
        `transaction.business_key = '${business_key}'` +
          `AND transaction.completion = 'Belum Lunas'` +
          (category ? `AND transaction.category = '${category}'` : ''),
      )
      .orderBy('transaction.datetime', 'DESC')
      .getMany();

    if (findTransactions) if (!findTransactions) throw new HttpException(409, 'No transaction found that doesnt completed.');

    return findTransactions;
  }

  public async findAllTransactionByCategory(
    business_key: string,
    month: number,
    year: number,
    category: TransactionCategory,
  ): Promise<Transaction[]> {
    console.log(category);
    const findTransactions: Transaction[] = await TransactionEntity.createQueryBuilder('transaction')
      .where(
        `transaction.business_key = '${business_key}' AND transaction.category = '${category}' 
      AND DATE_PART('month',transaction.datetime) = '${month}' AND DATE_PART('year',transaction.datetime) = '${year}'`,
      )
      .orderBy('transaction.datetime', 'DESC')
      .getMany();
    console.log(findTransactions);

    if (!findTransactions) throw new HttpException(409, 'No transaction found in that category.');

    return findTransactions;
  }

  public async getNettIncome(from: Date, to: Date, business_key: string): Promise<Transaction[]> {
    const findTransactions: Transaction[] =
      await TransactionEntity.query(`SELECT DATE_PART('month', datetime) as month, DATE_PART('year', datetime) as year, sum(amount) AS amount
    FROM   transaction_entity
    WHERE transaction_entity.business_key = '${business_key}' AND (datetime BETWEEN '${formatDate(from)}' AND '${formatDate(
        to,
      )}' AND completion = 'Lunas' )
    GROUP  BY month, year
    ORDER BY month, year;`);

    if (!findTransactions) throw new HttpException(409, 'No transaction found within that range.');

    return findTransactions;
  }

  public async getSaleData(from: Date, to: Date, business_key: string): Promise<Transaction[]> {
    const findTransactions: Transaction[] =
      await TransactionEntity.query(`SELECT date_part('month', datetime) as month, date_part('year', datetime) as year, sum(amount) as total
    FROM   transaction_entity
    WHERE transaction_entity.business_key = '${business_key}' AND (datetime BETWEEN '${formatDate(from)}' AND '${formatDate(
        to,
      )}') AND completion = 'Lunas' AND category IN ('Penjualan', 'Retur Penjualan', 'Potongan Harga Penjualan')
    GROUP BY month,year
    ORDER BY month,year;`);
    if (!findTransactions) throw new HttpException(409, 'No transaction found within that range.');

    return findTransactions;
  }

  public async getContributionData(from: Date, to: Date, contributionType: string, business_key: string): Promise<Transaction[]> {
    const findTransactions: Transaction[] = await TransactionEntity.query(`SELECT category, SUM(amount) as total
    FROM   transaction_entity
    WHERE transaction_entity.business_key = '${business_key}' AND (datetime BETWEEN '${formatDate(from)}' AND '${formatDate(to)}') AND ${
      contributionType === 'income' ? 'amount > 0' : 'amount < 0'
    } AND completion = 'Lunas'
    GROUP BY category;`);
    if (!findTransactions) throw new HttpException(409, 'No transaction found within that range.');

    return findTransactions;
  }

  public async getPenjualanPiutangData(from: Date, to: Date, business_key: string) {
    const data = await TransactionEntity.query(`SELECT (SELECT sum(amount) as total
    FROM   transaction_entity
    WHERE transaction_entity.business_key = '${business_key}' AND (datetime BETWEEN '${formatDate(from)}' AND '${formatDate(
      to,
    )}') AND category = 'Penjualan' AND completion = 'Lunas') as Penjualan, 
    (SELECT sum(amount) as total
    FROM   transaction_entity
    WHERE transaction_entity.business_key = '${business_key}' AND (datetime BETWEEN '${formatDate(from)}' AND '${formatDate(
      to,
    )}') AND category = 'Penjualan' AND completion = 'Belum Lunas') as Piutang
    ;`);
    if (!data) throw new HttpException(409, 'No transaction found within that range.');

    return data;
  }

  public async getPenjualanBersih(start: Date, end: Date, business_key: string): Promise<Number> {
    const penjualanBersih: Number = await TransactionEntity.query(`SELECT sum(amount) as PENJUALAN_BERSIH
    FROM   transaction_entity
    WHERE transaction_entity.business_key = '${business_key}' AND (datetime BETWEEN '${formatDate(start)}' AND '${formatDate(
      end,
    )}') AND category IN ('Penjualan','Retur Penjualan','Potongan Harga Penjualan') AND completion = 'Lunas';`);
    if (!penjualanBersih[0]) throw new HttpException(409, 'No value');

    return penjualanBersih[0];
  }

  public async getHPP(start: Date, end: Date, business_key: string): Promise<Number> {
    const HPPValue: Number = await TransactionEntity.query(`SELECT sum(- amount) as HPP
    from transaction_entity
    WHERE transaction_entity.business_key = '${business_key}' AND (datetime BETWEEN '${formatDate(start)}' AND '${formatDate(
      end,
    )}') AND completion = 'Lunas' AND category IN ('Beban Angkut Pembelian', 'Gaji Karyawan Produksi', 'Pembelian Bahan Baku','Potongan Pembelian Barang atau Jasa', 'Retur Pembelian Barang atau Jasa');`);
    if (!HPPValue[0]) throw new HttpException(409, 'No value');

    return HPPValue[0];
  }

  public async getBiayaPenjualanUmumAdmOperasional(start: Date, end: Date, business_key: string): Promise<Number> {
    const biaya: Number = await TransactionEntity.query(`SELECT - sum(amount) as biaya_penjualan_umum_adm_operasional
    from transaction_entity
    WHERE transaction_entity.business_key = '${business_key}' AND (datetime BETWEEN '${formatDate(start)}' AND '${formatDate(
      end,
    )}') AND completion = 'Lunas' AND category IN ('Biaya Pengiriman Barang','Biaya Pemeliharaan Sistem', 'Biaya Pemasaran', 'Biaya Pemeliharaan Situs Web','Biaya Utilitas dan Peralatan Kantor','Biaya Pemeliharaan Sistem','Biaya Listrik','Biaya Gas','Biaya Air','Biaya Telepon', 'Gaji Karyawan Non Produksi');
    `);
    if (!biaya[0]) throw new HttpException(409, 'No value');
    return biaya[0];
  }

  public async getBiayaKontrak(start: Date, end: Date, business_key: string): Promise<Number> {
    const biaya: Number = await TransactionEntity.query(`SELECT - sum(amount) as biaya_kontrak
    from transaction_entity
    WHERE transaction_entity.business_key = '${business_key}' AND (datetime BETWEEN '${formatDate(start)}' AND '${formatDate(
      end,
    )}') AND completion = 'Lunas' AND category = 'Biaya Sewa';
    `);
    if (!biaya[0]) throw new HttpException(409, 'No value');
    return biaya[0];
  }

  public async getBiayaLainnya(start: Date, end: Date, business_key: string): Promise<Number> {
    const biaya: Number = await TransactionEntity.query(`SELECT - sum(amount) as biaya_lainnya
    from transaction_entity
    WHERE transaction_entity.business_key = '${business_key}' AND (datetime BETWEEN '${formatDate(start)}' AND '${formatDate(
      end,
    )}') AND completion = 'Lunas' AND category = 'Pengeluaran Lainnya';
    `);
    if (!biaya[0]) throw new HttpException(409, 'No value');
    return biaya[0];
  }

  public async getPendapatanLainnya(start: Date, end: Date, business_key: string): Promise<Number> {
    const pendapatan: Number = await TransactionEntity.query(`SELECT sum(amount) as pendapatan_lainnya
      from transaction_entity
      WHERE transaction_entity.business_key = '${business_key}' AND (datetime BETWEEN '${formatDate(start)}' AND '${formatDate(
      end,
    )}') AND completion = 'Lunas' AND category = 'Pemasukan Lainnya';
      `);
    if (!pendapatan[0]) throw new HttpException(409, 'No value');
    return pendapatan[0];
  }

  public async getPiutang(start: Date, end: Date, business_key: string): Promise<Number> {
    const piutang: Number = await TransactionEntity.query(`SELECT sum(amount) as piutang
      from transaction_entity
      WHERE transaction_entity.business_key = '${business_key}' AND (datetime BETWEEN '${formatDate(start)}' AND '${formatDate(
      end,
    )}') AND completion = 'Belum Lunas' AND amount > 0;
      `);
    if (!piutang[0]) throw new HttpException(409, 'No value');
    return piutang[0];
  }

  public async getHutang(start: Date, end: Date, business_key: string): Promise<Number> {
    const hutang: Number = await TransactionEntity.query(`SELECT - sum(amount) as hutang
      from transaction_entity
      WHERE transaction_entity.business_key = '${business_key}' AND (datetime BETWEEN '${formatDate(start)}' AND '${formatDate(
      end,
    )}') AND completion = 'Belum Lunas' AND amount < 0;
      `);
    if (!hutang[0]) throw new HttpException(409, 'No value');
    return hutang[0];
  }

  public async getModal(start: Date, end: Date, business_key: string): Promise<Number> {
    const modal: Number = await TransactionEntity.query(`SELECT sum(amount) as modal
      from transaction_entity
      WHERE transaction_entity.business_key = '${business_key}' AND (datetime BETWEEN '${formatDate(start)}' AND '${formatDate(
      end,
    )}') AND completion = 'Lunas' AND category = 'Penambahan Modal';
      `);
    if (!modal[0]) throw new HttpException(409, 'No value');
    return modal[0];
  }

  public async getLabaDitahan(start: Date, end: Date, business_key: string): Promise<Number> {
    const labaDitahan: Number = await TransactionEntity.query(`SELECT - sum(amount) as laba_ditahan
      from transaction_entity
      WHERE transaction_entity.business_key = '${business_key}' AND (datetime BETWEEN '${formatDate(start)}' AND '${formatDate(
      end,
    )}') AND completion = 'Lunas' AND category = 'Laba Ditahan';
      `);
    if (!labaDitahan[0]) throw new HttpException(409, 'No value');
    return labaDitahan[0];
  }

  public async getPrive(start: Date, end: Date, business_key: string): Promise<Number> {
    const prive: Number = await TransactionEntity.query(`SELECT - sum(amount) as prive
      from transaction_entity
      WHERE transaction_entity.business_key = '${business_key}' AND (datetime BETWEEN '${formatDate(start)}' AND '${formatDate(
      end,
    )}') AND completion = 'Lunas' AND category = 'Pribadi / Prive';
      `);
    if (!prive[0]) throw new HttpException(409, 'No value');
    return prive[0];
  }
}

export default TransactionService;
