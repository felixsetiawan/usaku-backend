import { Router } from 'express';
import TransactionController from '@controllers/transaction.controller';
import { Routes } from '@interfaces/routes.interface';

class TransactionRoute implements Routes {
  public path = '/transactions';
  public router = Router();
  public transactionController = new TransactionController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.transactionController.getTransactions);
    this.router.get(`${this.path}/ranged`, this.transactionController.getTransactionInRange);
    this.router.get(`${this.path}/nettIncome`, this.transactionController.getNettIncome);
    this.router.get(`${this.path}/saleData`, this.transactionController.getSaleData);
    this.router.get(`${this.path}/contributionData`, this.transactionController.getContributionData);
    this.router.get(`${this.path}/monthly`, this.transactionController.getMonthlyTransaction);
    this.router.get(`${this.path}/yearly`, this.transactionController.getYearlyTransaction);
    this.router.get(`${this.path}/summary`, this.transactionController.getSummary);
  }
}

export default TransactionRoute;
