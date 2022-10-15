import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from 'src/constants/orders/order-status.enum';
import { PaymentStatus } from 'src/constants/orders/payment-status.enum';
import { Order } from 'src/entities/orders/orders.entity';
import { OrderItemDto } from './order-item.dto';

export class OrderDto implements Readonly<OrderDto> {
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
  public notes?: string;
  public shippingAddress: string;
  public updatedAt: Date;
  public createdAt: Date;
  public deletedAt: Date;
  public orderItems: OrderItemDto[];

  constructor(partial: Partial<Order>) {
    Object.assign(this, partial);
  }
}
