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
    this.router.get(`${this.path}/members`, authMiddleware, this.employeeController.findAllMembers);
    this.router.get(`${this.path}/business`, newUserMiddleware, this.employeeController.findAllBusiness);
    this.router.post(this.path, newUserMiddleware, this.employeeController.newEmployee);
    this.router.get(this.path, authMiddleware, this.employeeController.findRole);
    this.router.delete(this.path, authMiddleware, this.employeeController.deleteEmployee);
  }
}

export default BusinessRoute;
