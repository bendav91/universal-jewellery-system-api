import { ApiProperty } from '@nestjs/swagger';
import { OrderItemType } from 'src/constants/orders/order-item-type';

export class OrderItemDto implements Readonly<OrderItemDto> {
  public createdAt: Date;
  public deletedAt: Date;
  public orderItemNumber: string;
  @ApiProperty({
    enum: OrderItemType,
    default: OrderItemType.UNKNOWN,
  })
  public status: OrderItemType;
  public updatedAt: Date;
  public orderNumber: string;

  constructor(partial: Partial<OrderItemDto>) {
    Object.assign(this, partial);
  }
}
