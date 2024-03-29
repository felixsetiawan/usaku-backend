import { NextFunction, Request, Response } from 'express';
import { CreateUserDto } from '@dtos/users.dto';
import { User } from '@interfaces/users.interface';
import userService from '@services/users.service';
class UsersController {
  public userService = new userService();

  public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.uid;
      const path: string = await this.userService.login(userId);
      res.status(200).json({ path });
    } catch (error) {
      next(error);
    }
  };
  public editMember = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.uid;
      const userData = req.body;
      await this.userService.editMember(userId, userData);
      res.status(200).json({ message: 'edited' });
    } catch (error) {
      next(error);
    }
  };

  public getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const findAllUsersData: User[] = await this.userService.findAllUser();

      res.status(200).json({ data: findAllUsersData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.uid;
      const findOneUserData: User = await this.userService.findUserById(userId);

      res.status(200).json({ data: findOneUserData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: CreateUserDto = req.body;
      const uid = req.uid;
      const createUserData: User = await this.userService.createUser(userData, uid);

      res.status(201).json({ data: createUserData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.uid;
      const userData: CreateUserDto = req.body;
      const updateUserData: User = await this.userService.updateUser(userId, userData);

      res.status(200).json({ data: updateUserData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };
}

export default UsersController;
