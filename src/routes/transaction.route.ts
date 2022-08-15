import { Router } from 'express';
import TransactionController from '@controllers/transaction.controller';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@/middlewares/auth.middleware';

class TransactionRoute implements Routes {
  public path = '/transactions';
  public router = Router();
  public transactionController = new TransactionController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, authMiddleware, this.transactionController.postTransactions);
    this.router.patch(`${this.path}`, authMiddleware, this.transactionController.updateTransactions);
    this.router.get(`${this.path}`, authMiddleware, this.transactionController.getTransactionsByUid);
    this.router.get(`${this.path}/ranged`, authMiddleware, this.transactionController.getTransactionInRange);
    this.router.get(`${this.path}/nettIncome`, authMiddleware, this.transactionController.getNettIncome);
    this.router.get(`${this.path}/saleData`, authMiddleware, this.transactionController.getSaleData);
    this.router.get(`${this.path}/contributionData`, authMiddleware, this.transactionController.getContributionData);
    this.router.get(`${this.path}/monthly`, authMiddleware, this.transactionController.getMonthlyTransaction);
    this.router.get(`${this.path}/yearly`, authMiddleware, this.transactionController.getYearlyTransaction);
    this.router.get(`${this.path}/summary`, authMiddleware, this.transactionController.getSummary);
    this.router.get(`${this.path}/visualizationData`, authMiddleware, this.transactionController.getChartData);
  }
}

export default TransactionRoute;
