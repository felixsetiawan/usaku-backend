import { IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  public uid: string;

  @IsString()
  public name: string;

  public businessName: string;

  public phoneNumber: string;

  public businessNumber: string;

  public address: string;

  public IDCard: string;
}
