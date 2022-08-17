import { Request } from 'express';


export interface RequestWithUser extends Request {
  uid: string;
}
