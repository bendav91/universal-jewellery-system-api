import { ApiProperty } from '@nestjs/swagger';
import { PaymentType } from 'src/constants/payments/payment-type.enum';
import { AbstractDto } from '../abstract/abstract.dto';

export class PaymentDto extends AbstractDto implements Readonly<PaymentDto> {
  public paymentId: string;
  public amount: number;
  public paymentType: PaymentType;
  @ApiProperty({ nullable: true })
  public paymentProvider: string | null;
  @ApiProperty({ nullable: true })
  public paymentProviderReference: string | null;

  constructor({
    createdAt,
    updatedAt,
    deletedAt,
    ...rest
  }: Partial<PaymentDto>) {
    super({ createdAt, updatedAt, deletedAt });
    Object.assign(this, rest);
  }
}
