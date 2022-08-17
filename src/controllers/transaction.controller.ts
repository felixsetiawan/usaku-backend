import { NextFunction, Request, Response } from 'express';
import { Transaction } from '@interfaces/transaction.interface';
import { createTransactionDto } from '@dtos/transactions.dto';
import transactionService from '@services/transaction.service';

class TransactionController {
  public transactionService = new transactionService();

  public postTransactions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const uid = req.uid;
      const transactionData: createTransactionDto = req.body;
      const newTransaction: Transaction = await this.transactionService.createTransaction(transactionData, uid);

      res.status(201).json({ data: newTransaction, message: 'transaction created' });
    } catch (error) {
      next(error);
    }
  };

  public updateTransactions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const uid = req.uid;
      const transactionData: createTransactionDto = req.body;
      const updateTransaction: Transaction = await this.transactionService.updateTransaction(transactionData, uid);

      res.status(201).json({ data: updateTransaction, message: 'transaction updated' });
    } catch (error) {
      next(error);
    }
  };

  public getTransactions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const uid = req.uid;
      const findAllTransactions: Transaction[] = await this.transactionService.findAllTransaction(uid);

      res.status(200).json({ data: findAllTransactions, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getTransactionsByUid = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const uid = req.uid;
      const findAllTransactions: Transaction[] = await this.transactionService.findAllTransactionByUid(uid);

      res.status(200).json({ data: findAllTransactions, message: 'findAll by Uid' });
    } catch (error) {
      next(error);
    }
  };

  public getCurrentTransaction = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const uid = req.uid;
      const day = Number(req.query.day);
      const findAllTransactions: Transaction[] = await this.transactionService.findCurrentTransaction(day, uid);

      res.status(200).json({ data: findAllTransactions, message: 'findAll by Uid and current month', day });
    } catch (error) {
      next(error);
    }
  };

  public getTransactionsByCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const uid = req.uid;
      const category = req.query.category;
      const findAllTransactions: Transaction[] = await this.transactionService.findAllTransactionByCategory(uid, category);

      res.status(200).json({ data: findAllTransactions, message: 'findAll by Category', category });
    } catch (error) {
      next(error);
    }
  };

  public getTransactionInRange = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const uid = req.uid;
      const start = req.query.start;
      const end = req.query.end;
      const findTransactions: Transaction[] = await this.transactionService.findTransactionsInRange(start, end, uid);

      res.status(200).json({ data: findTransactions, message: 'findAll in range' });
    } catch (error) {
      next(error);
    }
  };

  public getMonthlyTransaction = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const uid = req.uid;
      const month = Number(req.query.month);
      const findTransactions: Transaction[] = await this.transactionService.findMonthlyTransaction(month, uid);

      res.status(200).json({ data: findTransactions, message: 'findAll monthly', month });
    } catch (error) {
      next(error);
    }
  };

  public getYearlyTransaction = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const uid = req.uid;
      const year = Number(req.query.year);
      const findTransactions: Transaction[] = await this.transactionService.findYearlyTransaction(year, uid);

      res.status(200).json({ data: findTransactions, message: 'findAll yearly' });
    } catch (error) {
      next(error);
    }
  };

  public getSummary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const uid = req.uid;
      const type = req.query.type;
      let transactions: Transaction[];
      if (type === 'monthly') {
        const month = Number(req.query.month);
        transactions = await this.transactionService.findMonthlyTransaction(month, uid);
      } else if (type === 'yearly') {
        const year = Number(req.query.year);
        transactions = await this.transactionService.findYearlyTransaction(year, uid);
      } else if (type === 'ranged') {
        const start = req.query.start;
        const end = req.query.end;
        transactions = await this.transactionService.findTransactionsInRange(start, end, uid);
      }
      if (transactions.length) {
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
      } else {
        res.status(204).json({ message: `Empty Data` });
      }
    } catch (error) {
      next(error);
    }
  };

  public getChartData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const uid = req.uid;
      const chartType = req.query.chartType;
      const type = req.query.type;
      let findTransactions: Transaction[];
      if (type === 'monthly') {
        const month = req.query.month;
        const chartTypeFunction = {
          line1: this.transactionService.getMonthlyNettIncomeData,
          line2: this.transactionService.getMonthlySaleData,
          pie: this.transactionService.getMonthlyContributionData,
        };
        if (chartType == 'pie') {
          const contributionType = req.query.contributionType;
          findTransactions = await chartTypeFunction[chartType](month, contributionType, uid);
        } else {
          findTransactions = await chartTypeFunction[chartType](month, uid);
        }
      } else if (type === 'yearly') {
        const year = req.query.year;
        const chartTypeFunction = {
          line1: this.transactionService.getYearlyNettIncomeData,
          line2: this.transactionService.getYearlySaleData,
          pie: this.transactionService.getYearlyContributionData,
        };
        if (chartType == 'pie') {
          const contributionType = req.query.contributionType;
          findTransactions = await chartTypeFunction[chartType](year, contributionType, uid);
        } else {
          findTransactions = await chartTypeFunction[chartType](year, uid);
        }
      } else if (type === 'ranged') {
        const start = req.query.start;
        const end = req.query.end;
        const chartTypeFunction = {
          line1: this.transactionService.getRangedNettIncomeData,
          line2: this.transactionService.getRangedSaleData,
          pie: this.transactionService.getRangedContributionData,
        };
        if (chartType == 'pie') {
          const contributionType = req.query.contributionType;
          findTransactions = await chartTypeFunction[chartType](start, end, contributionType, uid);
        } else {
          findTransactions = await chartTypeFunction[chartType](start, end, uid);
        }
      }
      if (findTransactions.length) {
        res.status(200).json({ data: findTransactions, message: `${type} chart data` });
      } else {
        res.status(204).json({ message: `Empty Data` });
      }
    } catch (error) {
      next(error);
    }
  };

  public getNettIncome = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const uid = req.uid;
      const type = req.query.type;
      let findTransactions: Transaction[];
      if (type === 'monthly') {
        const month = req.query.month;
        findTransactions = await this.transactionService.getMonthlyNettIncomeData(month, uid);
      } else if (type === 'yearly') {
        const year = req.query.year;
        findTransactions = await this.transactionService.getYearlyNettIncomeData(year, uid);
      } else if (type === 'ranged') {
        const start = req.query.start;
        const end = req.query.end;
        findTransactions = await this.transactionService.getRangedNettIncomeData(start, end, uid);
      }
      if (findTransactions.length) {
        res.status(200).json({ data: findTransactions, message: `${type} nett income.` });
      } else {
        res.status(204).json({ message: `Empty Data` });
      }
    } catch (error) {
      next(error);
    }
  };

  public getSaleData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const uid = req.uid;
      const type = req.query.type;
      let findTransactions: Transaction[];
      if (type === 'monthly') {
        const month = req.query.month;
        findTransactions = await this.transactionService.getMonthlySaleData(month, uid);
      } else if (type === 'yearly') {
        const year = req.query.year;
        findTransactions = await this.transactionService.getYearlySaleData(year, uid);
      } else if (type === 'ranged') {
        const start = req.query.start;
        const end = req.query.end;
        findTransactions = await this.transactionService.getRangedSaleData(start, end, uid);
      }
      if (findTransactions.length) {
        res.status(200).json({ data: findTransactions, message: `${type} sale data.` });
      } else {
        res.status(204).json({ message: `Empty Data` });
      }
    } catch (error) {
      next(error);
    }
  };

  public getContributionData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const uid = req.uid;
      const type = req.query.type;
      const contributionType = req.query.contributionType;
      let findTransactions: Transaction[];
      if (type === 'monthly') {
        const month = req.query.month;
        findTransactions = await this.transactionService.getMonthlyContributionData(month, contributionType, uid);
      } else if (type === 'yearly') {
        const year = req.query.year;
        findTransactions = await this.transactionService.getYearlyContributionData(year, contributionType, uid);
      } else if (type === 'ranged') {
        const start = req.query.start;
        const end = req.query.end;
        findTransactions = await this.transactionService.getRangedContributionData(start, end, contributionType, uid);
      }
      if (findTransactions) {
        res.status(200).json({ data: findTransactions, message: `${type} ${contributionType} contribution data.` });
      } else {
        res.status(204).json({ message: `Empty Data` });
      }
    } catch (error) {
      next(error);
    }
  };
}

export default TransactionController;
