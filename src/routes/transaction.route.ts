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
    this.router.get(`${this.path}`, authMiddleware, this.transactionController.getMonthlyTransaction);
    this.router.delete(`${this.path}/delete`, authMiddleware, this.transactionController.deleteTransaction);
    this.router.get(`${this.path}/category`, authMiddleware, this.transactionController.getTransactionsByCategory);
    this.router.get(`${this.path}/credits`, authMiddleware, this.transactionController.getIncompleteTransactions);
    this.router.get(`${this.path}/nettIncomeData`, authMiddleware, this.transactionController.getNettIncomeData);
    this.router.get(`${this.path}/saleData`, authMiddleware, this.transactionController.getSaleData);
    this.router.get(`${this.path}/penjualanPiutangData`, authMiddleware, this.transactionController.getPenjualanPiutangData);
    this.router.get(`${this.path}/contributionData`, authMiddleware, this.transactionController.getContributionData);
    this.router.get(`${this.path}/summaryData`, authMiddleware, this.transactionController.getSummaryData);
  }
}

export default TransactionRoute;
