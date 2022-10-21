import { Exclude } from 'class-transformer';
import { OrderItemType } from 'src/constants/orders/order-item-type';
import { ColumnDecimalTransformer } from 'src/transformers/columnDecimalTransformer.transformer';
import { Entity, Column, ManyToOne, JoinTable, ManyToMany } from 'typeorm';
import { AbstractEntity } from '../abstract/abstract-entity';
import { Tax } from '../taxes/tax.entity';
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

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0.0,
    transformer: new ColumnDecimalTransformer(),
  })
  public grossPrice: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0.0,
    transformer: new ColumnDecimalTransformer(),
  })
  public discountAmount: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0.0,
    transformer: new ColumnDecimalTransformer(),
  })
  public netPrice: number;

  @ManyToMany(() => Tax)
  @JoinTable()
  taxes: Tax[];

  @ManyToOne(() => Order, (order) => order.orderItems)
  @Exclude()
  order: Order;

  constructor(partial: Partial<OrderItem>) {
    const { createdAt, updatedAt, deletedAt, id, ...rest } = partial ?? {};
    super({ createdAt, updatedAt, deletedAt, id });
    Object.assign(this, rest);
  }
}
