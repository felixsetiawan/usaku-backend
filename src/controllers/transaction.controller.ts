import { NextFunction, Request, Response } from 'express';
import { Transaction } from '@interfaces/transaction.interface';
import transactionService from '@services/transaction.service';

class TransactionController {
  public transactionService = new transactionService();

  public getTransactions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const findAllTransactions: Transaction[] = await this.transactionService.findAllTransaction();

      res.status(200).json({ data: findAllTransactions, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getTransactionInRange = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const start = req.body.start;
      const end = req.body.end;
      const findTransactions: Transaction[] = await this.transactionService.findTransactionsInRange(start, end);

      res.status(200).json({ data: findTransactions, message: 'findAll in range' });
    } catch (error) {
      next(error);
    }
  };

  public getMonthlyTransaction = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const month = Number(req.body.month);
      const findTransactions: Transaction[] = await this.transactionService.findMonthlyTransaction(month);

      res.status(200).json({ data: findTransactions, message: 'findAll monthly' });
    } catch (error) {
      next(error);
    }
  };

  public getYearlyTransaction = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const year = Number(req.body.year);
      const findTransactions: Transaction[] = await this.transactionService.findYearlyTransaction(year);

      res.status(200).json({ data: findTransactions, message: 'findAll yearly' });
    } catch (error) {
      next(error);
    }
  };

  public getSummary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const type = req.body.type;
      let transactions: Transaction[];
      if (type === 'monthly') {
        const month = Number(req.body.month);
        transactions = await this.transactionService.findMonthlyTransaction(month);
      } else if (type === 'yearly') {
        const year = Number(req.body.year);
        transactions = await this.transactionService.findYearlyTransaction(year);
      } else if (type === 'ranged') {
        const start = req.body.start;
        const end = req.body.end;
        transactions = await this.transactionService.findTransactionsInRange(start, end);
      }
      const categoriesObject = {
        peralatan: 0,
        listrik: 0,
        air: 0,
        modal: 0,
        utang_usaha: 0,
        piutang_usaha: 0,
        investasi: 0,
        gaji: 0,
        penjualan: 0,
        lainnya: 0,
      };
      transactions.forEach(value => {
        categoriesObject[value['category']] += value['amount'];
      });
      const total = { pendapatan: 0, pengeluaran: 0, nett: 0 };
      Object.values(categoriesObject).forEach((value: number) => (value >= 0 ? (total['pendapatan'] += value) : (total['pengeluaran'] += value)));
      total.nett = total.pendapatan - total.pengeluaran;
      res.status(200).json({ data: categoriesObject, total, message: `${type} summary` });
    } catch (error) {
      next(error);
    }
  };

  public getNettIncome = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const type = req.body.type;
      let findTransactions: Transaction[];
      if (type === 'monthly') {
        const month = req.body.month;
        findTransactions = await this.transactionService.getMonthlyNettIncomeData(month);
      } else if (type === 'yearly') {
        const year = req.body.year;
        findTransactions = await this.transactionService.getYearlyNettIncomeData(year);
      } else if (type === 'ranged') {
        const start = req.body.start;
        const end = req.body.end;
        findTransactions = await this.transactionService.getRangedNettIncomeData(start, end);
      }

      res.status(200).json({ data: findTransactions, message: `${type} nett income.` });
    } catch (error) {
      next(error);
    }
  };

  public getSaleData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const type = req.body.type;
      let findTransactions: Transaction[];
      if (type === 'monthly') {
        const month = req.body.month;
        findTransactions = await this.transactionService.getMonthlySaleData(month);
      } else if (type === 'yearly') {
        const year = req.body.year;
        findTransactions = await this.transactionService.getYearlySaleData(year);
      } else if (type === 'ranged') {
        const start = req.body.start;
        const end = req.body.end;
        findTransactions = await this.transactionService.getRangedSaleData(start, end);
      }

      res.status(200).json({ data: findTransactions, message: `${type} sale data.` });
    } catch (error) {
      next(error);
    }
  };

  public getContributionData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const type = req.body.type;
      const contributionType = req.body.contributionType;
      let findTransactions: Transaction[];
      if (type === 'monthly') {
        const month = req.body.month;
        findTransactions = await this.transactionService.getMonthlyContributionData(month, contributionType);
      } else if (type === 'yearly') {
        const year = req.body.year;
        findTransactions = await this.transactionService.getYearlyContributionData(year, contributionType);
      } else if (type === 'ranged') {
        const start = req.body.start;
        const end = req.body.end;
        findTransactions = await this.transactionService.getRangedContributionData(start, end, contributionType);
      }

      res.status(200).json({ data: findTransactions, message: `${type} ${contributionType} contribution data.` });
    } catch (error) {
      next(error);
    }
  };
}

export default TransactionController;
