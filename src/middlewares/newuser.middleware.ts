import { NextFunction, Response } from 'express';
import { HttpException } from '@exceptions/HttpException';
import { RequestWithUser } from '@interfaces/auth.interface';
import { verifyToken } from '@utils/util';

const newUserMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const Authorization = req.cookies['Authorization'] || (req.header('Authorization') || req.header('007') ? req.header('007') : null);
    if (Authorization) {
      try {
        const uid = await verifyToken(Authorization);
        if (uid) {
          req.uid = uid;
          next();
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

export default newUserMiddleware;
