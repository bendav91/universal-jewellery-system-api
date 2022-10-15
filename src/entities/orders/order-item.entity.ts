import { Exclude } from 'class-transformer';
import { OrderItemType } from 'src/constants/orders/order-item-type';
import { Entity, Column, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../abstract/abstract-entity';
import { Order } from './orders.entity';

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

  @ManyToOne(() => Order, (order) => order.orderItems)
  @Exclude()
  order: Order;

  constructor(partial: Partial<OrderItem>) {
    const { createdAt, updatedAt, deletedAt, id, ...rest } = partial ?? {};
    super({ createdAt, updatedAt, deletedAt, id });
    Object.assign(this, rest);
  }
}
