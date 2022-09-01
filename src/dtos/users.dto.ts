import { IsNumber, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  public uid: string;

  @IsString()
  public name: string;

  @IsString()
  public email: string;

  @IsString()
  public address: string;

  @IsNumber()
  public cash: number;

  public businessName: string;

  public phoneNumber: string;

  public businessNumber: string;

  public IDCard: string;

  @IsString()
  public organization_key: string;
}
