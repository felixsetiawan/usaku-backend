import { NextFunction, Request, Response } from 'express';
import { CreateBusinessDto } from '@dtos/business.dto';
import { Business } from '@interfaces/business.interface';
import { User } from '@interfaces/users.interface';
import businessService from '@services/business.service';
class BusinessController {
  public businessService = new businessService();
  public createBusiness = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const businessData: CreateBusinessDto = req.body;
      const uid = req.uid;
      const createBusinessData: Business = await this.businessService.createBusiness(businessData, uid);

      res.status(201).json({ data: createBusinessData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public getBusinessProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const uid = req.uid;
      const business_key = req.business_key;
      const businessProfile: Business = await this.businessService.getBusinessProfile(business_key, uid);
      res.status(200).json({ data: businessProfile, message: 'found' });
    } catch (error) {
      next(error);
    }
  };

  public findAllMembers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const uid = req.uid;
      const business_key = req.business_key;
      const members: User[] = await this.businessService.findAllMembers(business_key);

      res.status(200).json({ data: members, message: 'found' });
    } catch (error) {
      next(error);
    }
  };
}

export default BusinessController;
