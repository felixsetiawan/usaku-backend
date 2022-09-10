import { NextFunction, Request, Response } from 'express';
import { Employee } from '@interfaces/employee.interface';
import employeeService from '@services/employee.service';
class BusinessController {
  public employeeService = new employeeService();

  public editRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const uid = req.body.uid;
      const business_key = req.business_key;
      const newRole = req.body.new_role;
      await this.employeeService.editRole(uid, business_key, newRole);

      res.status(200).json({ message: 'edited' });
    } catch (error) {
      next(error);
    }
  };

  public findAllMembers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const uid = req.uid;
      const business_key = req.business_key;
      const employee: Employee[] = await this.employeeService.findAllEmployee(uid, business_key);

      res.status(200).json({ data: employee, message: 'found' });
    } catch (error) {
      next(error);
    }
  };

  public findAllBusiness = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const uid = req.uid;
      const business_key = req.business_key;
      const employee: Employee[] = await this.employeeService.findAllBusiness(uid);

      res.status(200).json({ data: employee, message: 'found' });
    } catch (error) {
      next(error);
    }
  };

  public newEmployee = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const uid = req.uid;
      const businessKey = req.body.business_key;
      const employeeData = req.body;
      const employee: Employee = await this.employeeService.newEmployee(uid, businessKey, employeeData);

      res.status(200).json({ data: employee, message: 'joined' });
    } catch (error) {
      next(error);
    }
  };

  public findRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const uid = req.uid;
      const businessKey = req.business_key;
      const employee: Employee = await this.employeeService.findRole(uid, businessKey);

      res.status(200).json({ data: employee, message: 'found' });
    } catch (error) {
      next(error);
    }
  };

  public deleteEmployee = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const uid = req.body.uid;
      const businessKey = req.business_key;
      await this.employeeService.deleteEmployee(uid, businessKey);

      res.status(200).json({ message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default BusinessController;
