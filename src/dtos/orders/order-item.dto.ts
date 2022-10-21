import { ApiProperty } from '@nestjs/swagger';
import { OrderItemType } from 'src/constants/orders/order-item-type';
import { TaxDto } from '../taxes/tax.dto';

export class OrderItemDto implements Readonly<OrderItemDto> {
  public createdAt: Date;
  @ApiProperty({
    nullable: true,
  })
  public deletedAt: Date | null;
  public orderItemNumber: string;
  @ApiProperty({
    enum: OrderItemType,
    default: OrderItemType.UNKNOWN,
  })
  public status: OrderItemType;
  public updatedAt: Date;
  public orderNumber: string;
  public prices: {
    gross: number;
    net: number;
    discount: number;
  };

  public taxes: TaxDto[];

  constructor(partial: Partial<OrderItemDto>) {
    Object.assign(this, partial);
  }
}
