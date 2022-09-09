import { Router } from 'express';
import BusinessController from '@controllers/business.controller';
import { Routes } from '@interfaces/routes.interface';
import newUserMiddleware from '@/middlewares/newuser.middleware';
import authMiddleware from '@middlewares/auth.middleware';

class BusinessRoute implements Routes {
  public path = '/business';
  public router = Router();
  public businessController = new BusinessController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(this.path, newUserMiddleware, this.businessController.createBusiness);
    this.router.get(this.path, authMiddleware, this.businessController.getBusinessProfile);
    this.router.get(`${this.path}/members`, authMiddleware, this.businessController.findAllMembers);
  }
}

export default BusinessRoute;
