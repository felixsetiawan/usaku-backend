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

  public async updateTransaction(transactionData: createTransactionDto, uid: string, id: number): Promise<Transaction> {
    if (isEmpty(transactionData)) throw new HttpException(400, "You're not transactionData");

    const updateTransaction: UpdateResult = await TransactionEntity.update({ id, uid }, transactionData);
    console.log(updateTransaction);
    return null;
  }

  public async findAllTransaction(uid: string): Promise<Transaction[]> {
    const transactions: Transaction[] = await TransactionEntity.find();
    return transactions;
  }

  public async findCurrentTransaction(day: number, uid: string): Promise<Transaction[]> {
    const findTransactions: Transaction[] = await TransactionEntity.createQueryBuilder('transaction')
      .where(`transaction.uid = '${uid}' AND DATE_PART('day',transaction.datetime) = ${day}`)
      .getMany();

    console.log(findTransactions);
    if (!findTransactions) throw new HttpException(409, 'No transaction in today.');

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
    const findTransactions: Transaction[] = await TransactionEntity.query(`
    SELECT category
    FROM   transaction_entity
    WHERE transaction_entity.uid = '${uid}' AND category = ${category}
    `);
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
}

export default TransactionService;
