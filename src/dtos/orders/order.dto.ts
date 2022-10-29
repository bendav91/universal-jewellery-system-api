import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from 'src/constants/orders/order-status.enum';
import { PaymentStatus } from 'src/constants/orders/payment-status.enum';
import { Payments } from 'src/interfaces/payments.interface';
import { Prices } from 'src/interfaces/prices.interface';
import { AbstractDto } from '../abstract/abstract.dto';
import { PaymentDto } from '../payments/payment.dto';
import { UserDto } from '../users/user.dto';
import { OrderItemDto } from './order-item.dto';

export class OrderDto
  extends AbstractDto
  implements Readonly<OrderDto>, Prices, Payments
{
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

  @ApiProperty({
    nullable: true,
  })
  public notes: string | null;

  public orderNumber: string;
  public shippingAddress: string;
  public orderItems: OrderItemDto[];
  public user: UserDto;

  public prices: {
    gross: number;
    net: number;
    discount: number;
  };

  public payments: {
    entries: PaymentDto[];
    balance: number;
  };

  constructor({ createdAt, deletedAt, updatedAt, ...rest }: Partial<OrderDto>) {
    super({ createdAt, deletedAt, updatedAt });
    Object.assign(this, rest);
  }
}
