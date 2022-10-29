import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from 'src/constants/orders/order-status.enum';
import { PaymentStatus } from 'src/constants/orders/payment-status.enum';
import { UserType } from 'src/constants/users/user-type.enum';
import { Prices } from 'src/interfaces/prices.interface';
import { AbstractDto } from '../abstract/abstract.dto';
import { UserDto } from '../users/user.dto';
import { OrderItemDto } from './order-item.dto';

export class OrderDto
  extends AbstractDto
  implements Readonly<OrderDto>, Prices
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
  public orderNumber: string;
  @ApiProperty({
    nullable: true,
  })
  public notes: string | null;
  public shippingAddress: string;
  public orderItems: OrderItemDto[];

  public prices: {
    gross: number;
    net: number;
    discount: number;
  };

  public user: UserDto;

  constructor({ createdAt, deletedAt, updatedAt, ...rest }: Partial<OrderDto>) {
    super({ createdAt, deletedAt, updatedAt });
    Object.assign(this, rest);
  }
}
