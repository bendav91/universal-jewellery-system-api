import { ApiProperty } from '@nestjs/swagger';
import { OrderItemType } from 'src/constants/orders/order-item-type';
import { AbstractDto } from '../abstract/abstract.dto';
import { TaxDto } from '../taxes/tax.dto';

export class OrderItemDto
  extends AbstractDto
  implements Readonly<OrderItemDto>
{
  @ApiProperty({
    nullable: true,
  })
  public orderItemNumber: string;
  @ApiProperty({
    enum: OrderItemType,
    default: OrderItemType.UNKNOWN,
  })
  public status: OrderItemType;
  public orderNumber: string;
  public prices: {
    gross: number;
    net: number;
    discount: number;
  };

  public taxes: TaxDto[];

  constructor({
    createdAt,
    updatedAt,
    deletedAt,
    ...rest
  }: Partial<OrderItemDto>) {
    super({ createdAt, updatedAt, deletedAt });
    Object.assign(this, rest);
  }
}
