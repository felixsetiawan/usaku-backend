import { NextFunction, Response } from 'express';
import { HttpException } from '@exceptions/HttpException';
import { RequestWithUser } from '@interfaces/auth.interface';
import { verifyToken } from '@utils/util';
import { BusinessEntity } from '@/entities/business.entity';
import { UserEntity } from '@/entities/users.entity';
import { EmployeeEntity } from '@/entities/employee.entity';
import { User } from '@interfaces/users.interface';
import { Business } from '@/interfaces/business.interface';
import { Employee } from '@/interfaces/employee.interface';

const authMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const Authorization = req.cookies['Authorization'] || (req.header('Authorization') || req.header('_007') ? req.header('_007') : null);
    const uid = req.header('_770');

    const business_key = req.header('_012');

    if (Authorization && uid) {
      try {
        const decryptedToken = await verifyToken(Authorization);
        if (uid === decryptedToken) {
          req.uid = uid;
          if (business_key) {
            const findBusiness: Business = await BusinessEntity.findOne({ where: { business_key: business_key } });
            if (findBusiness) {
              req.business_key = findBusiness.business_key;
              next();
            } else {
              res.status(200).json({ message: 'Business key has expired' });
            }
          } else {
            res.status(200).json({ message: 'User Not Found' });
          }
        } else {
          res.status(200).json({ message: 'Wrong authentication token' });
        }
      } catch (error) {
        if (error?.code === 'auth/id-token-expired') {
          res.status(200).json('Token expired. Please refresh the page');
        }
      }
    } else {
      next(new HttpException(404, 'Authentication token missing'));
    }
  } catch (error) {
    next(new HttpException(401, 'Wrong authentication token'));
  }
};

export default authMiddleware;
