import { IsString } from 'class-validator';

export class createTransactionDto {
  public id: number;

  @IsString()
  public uid: string;

  public amount: number;

  public datetime: Date;

  public proof: string;
}
