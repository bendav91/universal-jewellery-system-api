import { ApiProperty } from '@nestjs/swagger';
import { OrderItemType } from 'src/constants/orders/order-item-type';
import { OrderItem } from 'src/entities/orders/order-item.entity';

export class OrderItemDto implements Readonly<OrderItemDto> {
  public createdAt: Date;
  public deletedAt?: Date;
  public orderItemNumber: string;
  @ApiProperty({
    enum: OrderItemType,
    default: OrderItemType.UNKNOWN,
  })
  public status: OrderItemType;
  public updatedAt: Date;

  constructor(partial: Partial<OrderItem>) {
    Object.assign(this, partial);
  }
}
