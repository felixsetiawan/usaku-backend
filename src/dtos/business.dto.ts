import { IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateBusinessDto {
  @IsUUID()
  public business_key: string;

  @IsString()
  public business_name: string;

  @IsNumber()
  public cash: number;

  @IsString()
  public owner: string;
}
