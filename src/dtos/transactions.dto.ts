import { IsString } from 'class-validator';

export class createTransactionDto {
  public id: number;

  @IsString()
  public business_key: string;

  public uid: string;

  public amount: number;

  public datetime: Date;
}
