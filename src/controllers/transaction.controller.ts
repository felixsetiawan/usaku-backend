import { NextFunction, Request, Response } from 'express';
import { Transaction } from '@interfaces/transaction.interface';
import { createTransactionDto } from '@dtos/transactions.dto';
import transactionService from '@services/transaction.service';

class TransactionController {
  public transactionService = new transactionService();

  public postTransactions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const business_key = req.business_key;
      const transactionData: createTransactionDto = req.body;
      const newTransaction: Transaction = await this.transactionService.createTransaction(transactionData, business_key);

      res.status(201).json({ data: newTransaction, message: 'transaction created' });
    } catch (error) {
      next(error);
    }
  };

  public updateTransactions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const business_key = req.business_key;
      const transactionData: createTransactionDto = req.body;
      const updateTransaction: Transaction = await this.transactionService.updateTransaction(transactionData, business_key);

      res.status(201).json({ data: updateTransaction, message: 'transaction updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteTransaction = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const business_key = req.business_key;
      const id = req.id;
      const deleteTransaction: Transaction = await this.transactionService.deleteTransaction(business_key, id);

      res.status(200).json({ data: deleteTransaction, message: 'transaction deleted' });
    } catch (error) {
      next(error);
    }
  };

  public getTransactions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const business_key = req.business_key;
      const findAllTransactions: Transaction[] = await this.transactionService.findAllTransaction(business_key);

      res.status(200).json({ data: findAllTransactions, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getTransactionsByUid = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const uid = req.uid;
      const business_key = req.business_key;
      console.log('BUSINESS KEY--------------------------', business_key);
      const findAllTransactions: Transaction[] = await this.transactionService.findAllTransactionByUid(business_key);

      res.status(200).json({ data: findAllTransactions, message: 'findAll by Uid' });
    } catch (error) {
      next(error);
    }
  };

  public getIncompleteTransactions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const business_key = req.business_key;
      const findAllTransactions: Transaction[] = await this.transactionService.findAllTransactionByCompletion(business_key);

      res.status(200).json({ data: findAllTransactions, message: 'findAll by Incomplete Transactions' });
    } catch (error) {
      next(error);
    }
  };

  public getCurrentTransaction = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const business_key = req.business_key;
      const day = Number(req.query.day);
      const findAllTransactions: Transaction[] = await this.transactionService.findCurrentTransaction(day, business_key);

      res.status(200).json({ data: findAllTransactions, message: 'findAll by Uid and current month', day });
    } catch (error) {
      next(error);
    }
  };

  public getTransactionsByCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const business_key = req.business_key;
      const category = req.query.category;
      const findAllTransactions: Transaction[] = await this.transactionService.findAllTransactionByCategory(business_key, category);

      res.status(200).json({ data: findAllTransactions, message: 'findAll by Category', category });
    } catch (error) {
      next(error);
    }
  };

  public getMonthlyTransaction = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const business_key = req.business_key;
      const month = Number(req.query.month);
      const findTransactions: Transaction[] = await this.transactionService.findMonthlyTransaction(month, business_key);

      res.status(200).json({ data: findTransactions, message: 'findAll monthly', month });
    } catch (error) {
      next(error);
    }
  };

  public getNettIncomeData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const business_key = req.business_key;
      const from = req.query.from;
      const to = req.query.to;
      const nettIncomeData = await this.transactionService.getNettIncome(from, to, business_key);
      if (nettIncomeData) {
        res.status(200).json({ data: nettIncomeData, message: `nettIncome data.` });
      } else {
        res.status(204).json({ message: `Empty Data` });
      }
    } catch (error) {
      next(error);
    }
  };

  public getSaleData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const business_key = req.business_key;
      const from = req.query.from;
      const to = req.query.to;
      const saleData = await this.transactionService.getSaleData(from, to, business_key);
      if (saleData) {
        res.status(200).json({ data: saleData, message: `sale data.` });
      } else {
        res.status(204).json({ message: `Empty Data` });
      }
    } catch (error) {
      next(error);
    }
  };

  public getContributionData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const business_key = req.business_key;
      const contributionType = req.query.contributionType;
      const from = req.query.from;
      const to = req.query.to;
      const contributionPercentageData = await this.transactionService.getContributionData(from, to, contributionType, business_key);
      if (contributionPercentageData) {
        res.status(200).json({ data: contributionPercentageData, message: `${contributionType} contribution data.` });
      } else {
        res.status(204).json({ message: `Empty Data` });
      }
    } catch (error) {
      next(error);
    }
  };

  public getPenjualanPiutangData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const business_key = req.business_key;
      const from = req.query.from;
      const to = req.query.to;
      const penjualanPiutangData = await this.transactionService.getPenjualanPiutangData(from, to, business_key);
      if (penjualanPiutangData) {
        res.status(200).json({ data: penjualanPiutangData[0], message: `penjualan and piutang data.` });
      } else {
        res.status(204).json({ message: `Empty Data` });
      }
    } catch (error) {
      next(error);
    }
  };

  public getSummaryData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const business_key = req.business_key;
      const from = req.query.from;
      const to = req.query.to;
      const hpp = (await this.transactionService.getHPP(from, to, business_key)).hpp || 0;
      const biayaKontrak = (await this.transactionService.getBiayaKontrak(from, to, business_key)).biaya_kontrak || 0;
      const biayaLainnya = (await this.transactionService.getBiayaLainnya(from, to, business_key)).biaya_lainnya || 0;
      const biayaOperasional =
        (await this.transactionService.getBiayaPenjualanUmumAdmOperasional(from, to, business_key)).biaya_penjualan_umum_adm_operasional || 0;
      const piutang = (await this.transactionService.getPiutang(from, to, business_key)).piutang || 0;
      const hutang = (await this.transactionService.getHutang(from, to, business_key)).hutang || 0;
      const labaDitahan = (await this.transactionService.getLabaDitahan(from, to, business_key)).laba_ditahan || 0;
      const modal = (await this.transactionService.getModal(from, to, business_key)).modal || 0;
      const penjualanBersih = (await this.transactionService.getPenjualanBersih(from, to, business_key)).penjualan_bersih || 0;
      const pendapatanLainnya = (await this.transactionService.getPendapatanLainnya(from, to, business_key)).pendapatan_lainnya || 0;
      const prive = (await this.transactionService.getPrive(from, to, business_key)).prive || 0;
      const summaryObj = {
        hpp,
        biayaKontrak,
        biayaLainnya,
        biayaOperasional,
        piutang,
        hutang,
        labaDitahan,
        modal,
        penjualanBersih,
        pendapatanLainnya,
        prive,
      };
      // console.log(summaryObj);
      // if () {
      res.status(200).json({ data: summaryObj, message: `summary data` });
      // } else {
      // res.status(204).json({ message: `Empty Data` });
      // }
    } catch (error) {
      next(error);
    }
  };
}

export default TransactionController;
