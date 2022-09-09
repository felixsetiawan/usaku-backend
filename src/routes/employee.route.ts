import { Router } from 'express';
import employeeController from '@controllers/employee.controller';
import { Routes } from '@interfaces/routes.interface';
import newUserMiddleware from '@/middlewares/newuser.middleware';
import authMiddleware from '@middlewares/auth.middleware';

class BusinessRoute implements Routes {
  public path = '/employee';
  public router = Router();
  public employeeController = new employeeController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/members`, newUserMiddleware, this.employeeController.findAllMembers);
    this.router.get(`${this.path}/business`, newUserMiddleware, this.employeeController.findAllBusiness);
    this.router.post(this.path, newUserMiddleware, this.employeeController.newEmployee);
  }
}

export default BusinessRoute;
