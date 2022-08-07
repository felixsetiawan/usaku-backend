import { Between, EntityRepository, Repository } from 'typeorm';
import { HttpException } from '@exceptions/HttpException';
import { Transaction } from '@interfaces/transaction.interface';
import { formatDate } from '@utils/util';
import { TransactionEntity } from '@/entities/transaction.entity';

@EntityRepository()
class TransactionService extends Repository<TransactionEntity> {
  public async findAllTransaction(): Promise<Transaction[]> {
    const transactions: Transaction[] = await TransactionEntity.find();
    return transactions;
  }

  public async findTransactionsInRange(start: Date, end: Date): Promise<Transaction[]> {
    const findTransactions: Transaction[] = await TransactionEntity.find({
      where: {
        datetime: Between(start, end),
      },
    });
    if (!findTransactions) throw new HttpException(409, 'No transaction found within that range.');

    return findTransactions;
  }

  public async findMonthlyTransaction(month: number): Promise<Transaction[]> {
    const findTransactions: Transaction[] = await TransactionEntity.createQueryBuilder('transaction')
      .where(`DATE_PART('month',transaction.datetime) = ${month}`)
      .getMany();
    if (!findTransactions) throw new HttpException(409, 'No transaction in that month.');

    return findTransactions;
  }

  public async findYearlyTransaction(year: number): Promise<Transaction[]> {
    const findTransactions: Transaction[] = await TransactionEntity.createQueryBuilder('transaction')
      .where(`DATE_PART('year',transaction.datetime) = ${year}`)
      .getMany();
    if (!findTransactions) throw new HttpException(409, 'No transaction in that year.');

    return findTransactions;
  }

  public async getRangedNettIncomeData(start: Date, end: Date): Promise<Transaction[]> {
    const findTransactions: Transaction[] = await TransactionEntity.query(`SELECT to_char(datetime, 'YYYY-MM-DD') AS date, sum(amount) AS amount
    FROM   transaction_entity
    WHERE datetime BETWEEN '${formatDate(start)}' AND '${formatDate(end)}'
    GROUP  BY 1;`);
    if (!findTransactions) throw new HttpException(409, 'No transaction found within that range.');

    return findTransactions;
  }

  public async getMonthlyNettIncomeData(month: number): Promise<Transaction[]> {
    const findTransactions: Transaction[] = await TransactionEntity.query(`SELECT to_char(datetime, 'YYYY-MM-DD') AS date, sum(amount) AS amount
    FROM   transaction_entity
    WHERE DATE_PART('month',datetime) = ${month} 
    GROUP  BY 1;`);
    if (!findTransactions) throw new HttpException(409, 'No transaction found in that month.');

    return findTransactions;
  }

  public async getYearlyNettIncomeData(year: number): Promise<Transaction[]> {
    const findTransactions: Transaction[] = await TransactionEntity.query(`SELECT to_char(datetime, 'YYYY-MM-DD') AS date, sum(amount) AS amount
    FROM   transaction_entity
    WHERE DATE_PART('year',datetime) = ${year} 
    GROUP  BY 1;`);
    if (!findTransactions) throw new HttpException(409, 'No transaction found in that year.');

    return findTransactions;
  }

  public async getRangedSaleData(start: Date, end: Date): Promise<Transaction[]> {
    const findTransactions: Transaction[] = await TransactionEntity.query(`SELECT to_char(datetime, 'YYYY-MM-DD') as date, COUNT(*) as sale_count
    FROM   transaction_entity
    WHERE datetime BETWEEN '${formatDate(start)}' AND '${formatDate(end)}'
    GROUP BY date;`);
    if (!findTransactions) throw new HttpException(409, 'No transaction found within that range.');

    return findTransactions;
  }

  public async getMonthlySaleData(month: number): Promise<Transaction[]> {
    const findTransactions: Transaction[] = await TransactionEntity.query(`SELECT to_char(datetime, 'YYYY-MM-DD') as date, COUNT(*) as sale_count
    FROM   transaction_entity
    WHERE DATE_PART('month',datetime) = ${month} 
    GROUP  BY date;`);
    if (!findTransactions) throw new HttpException(409, 'No transaction found in that month.');

    return findTransactions;
  }

  public async getYearlySaleData(year: number): Promise<Transaction[]> {
    const findTransactions: Transaction[] = await TransactionEntity.query(`SELECT to_char(datetime, 'YYYY-MM-DD') as date, COUNT(*) as sale_count
    FROM   transaction_entity
    WHERE DATE_PART('year',datetime) = ${year} 
    GROUP  BY date;`);
    if (!findTransactions) throw new HttpException(409, 'No transaction found in that year.');

    return findTransactions;
  }

  public async getRangedContributionData(start: Date, end: Date, contributionType: string): Promise<Transaction[]> {
    const findTransactions: Transaction[] = await TransactionEntity.query(`SELECT category, COUNT(*) as sale_count
    FROM   transaction_entity
    WHERE (datetime BETWEEN '${formatDate(start)}' AND '${formatDate(end)}') AND ${contributionType === 'income' ? 'amount > 0' : 'amount < 0'}
    GROUP BY category;`);
    if (!findTransactions) throw new HttpException(409, 'No transaction found within that range.');

    return findTransactions;
  }

  public async getMonthlyContributionData(month: number, contributionType: string): Promise<Transaction[]> {
    const findTransactions: Transaction[] = await TransactionEntity.query(`SELECT category, COUNT(*) as sale_count
    FROM   transaction_entity
    WHERE DATE_PART('month',datetime) = ${month} AND ${contributionType === 'income' ? 'amount > 0' : 'amount < 0'}
    GROUP BY category;`);
    if (!findTransactions) throw new HttpException(409, 'No transaction found within that range.');

    return findTransactions;
  }

  public async getYearlyContributionData(year: number, contributionType: string): Promise<Transaction[]> {
    const findTransactions: Transaction[] = await TransactionEntity.query(`SELECT category, COUNT(*) as sale_count
    FROM   transaction_entity
    WHERE DATE_PART('year',datetime) = ${year} AND ${contributionType === 'income' ? 'amount > 0' : 'amount < 0'}
    GROUP BY category;`);
    if (!findTransactions) throw new HttpException(409, 'No transaction found within that range.');

    return findTransactions;
  }
}

export default TransactionService;
