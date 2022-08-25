import { Router } from 'express';
import UsersController from '@controllers/users.controller';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@middlewares/auth.middleware';

class UsersRoute implements Routes {
  public path = '/user';
  public router = Router();
  public usersController = new UsersController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/login`, authMiddleware, this.usersController.login);
    this.router.get(`${this.path}`, authMiddleware, this.usersController.getUserById);
    this.router.post(`${this.path}`, authMiddleware, this.usersController.createUser);
    this.router.put(`${this.path}`, authMiddleware, this.usersController.updateUser);
  }
}

export default UsersRoute;
