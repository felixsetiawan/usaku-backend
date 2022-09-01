import { Request } from 'express';

export interface RequestWithUser extends Request {
  business_key: string;
}
