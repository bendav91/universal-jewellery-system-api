import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { OrderStatus } from 'src/constants/orders/order-status.enum';
import { PaymentStatus } from 'src/constants/orders/payment-status.enum';

export class OrderDto {
  @ApiProperty()
  public orderNumber: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional({})
  public notes?: string;

  @ApiProperty()
  public shippingAddress: string;

  @ApiProperty({
    enum: OrderStatus,
    default: OrderStatus.NEW,
  })
  public status: OrderStatus;

  @ApiProperty({
    enum: PaymentStatus,
    default: PaymentStatus.PAYMENT_PENDING,
  })
  public paymentStatus: PaymentStatus;

  @ApiProperty()
  public updatedAt: Date;

  @ApiProperty()
  public createdAt: Date;
}
