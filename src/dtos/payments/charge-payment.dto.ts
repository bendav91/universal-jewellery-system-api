import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { LineItemDto } from './line-item.dto';

export class ChargePaymentDto implements Readonly<ChargePaymentDto> {
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  public userId: string;

  @IsString()
  @IsNotEmpty()
  public cancelUrl: string;

  @IsString()
  @IsNotEmpty()
  public successUrl: string;

  @IsNotEmpty()
  public lineItems: LineItemDto[];

  @IsNotEmpty()
  @IsString()
  @MaxLength(13)
  public orderNumber: string;

  constructor(partial: Partial<ChargePaymentDto>) {
    Object.assign(this, partial);
  }
}
