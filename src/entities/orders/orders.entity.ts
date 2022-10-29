import { OrderStatus } from '../../constants/orders/order-status.enum';
import { Entity, Column, OneToMany, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../abstract/abstract-entity';
import { PaymentStatus } from 'src/constants/orders/payment-status.enum';
import { OrderItem } from './order-item.entity';
import { User } from '../users/user.entity';

@Entity()
export class Order extends AbstractEntity implements Readonly<Order> {
  @Column({
    unique: true,
  })
  public orderNumber: string;

  @Column()
  public shippingAddress: string;

  @Column({
    nullable: true,
  })
  public notes?: string;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.NEW,
    enumName: 'orderStatusEnum',
  })
  public status: OrderStatus;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PAYMENT_PENDING,
    enumName: 'paymentStatusEnum',
  })
  public paymentStatus: PaymentStatus;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  orderItems: OrderItem[];

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  constructor(partial: Partial<Order>) {
    const { createdAt, updatedAt, deletedAt, id, ...rest } = partial ?? {};
    super({ createdAt, updatedAt, deletedAt, id });
    Object.assign(this, rest);
  }
}
