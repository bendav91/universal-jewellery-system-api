import { OrderItemType } from 'src/constants/orders/order-item-type';
import { Entity, Column } from 'typeorm';
import { AbstractEntity } from '../abstract/abstract-entity';

@Entity()
export class OrderItem extends AbstractEntity implements Readonly<OrderItem> {
  @Column({
    unique: true,
  })
  public orderItemNumber: string;

  @Column({
    type: 'enum',
    enum: OrderItemType,
    default: OrderItemType.UNKNOWN,
    enumName: 'orderItemTypeEnum',
  })
  public status: OrderItemType;

  constructor(partial: Partial<OrderItem>) {
    const { createdAt, updatedAt, deletedAt, id, ...rest } = partial ?? {};
    super({ createdAt, updatedAt, deletedAt, id });
    Object.assign(this, rest);
  }
}
