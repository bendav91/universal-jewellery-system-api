import { ApiProperty } from '@nestjs/swagger';
import { OrderItemType } from 'src/constants/orders/order-item-type';
import { OrderStatus } from 'src/constants/orders/order-status.enum';

export class OrderItemDto {
  @ApiProperty()
  public orderItemNumber: string;

  @ApiProperty({
    enum: OrderStatus,
    default: OrderItemType.UNKNOWN,
  })
  public status: OrderItemType;

  @ApiProperty({
    nullable: true,
  })
  public deletedAt: Date | null;

  @ApiProperty()
  public updatedAt: Date;

  @ApiProperty()
  public createdAt: Date;
}
