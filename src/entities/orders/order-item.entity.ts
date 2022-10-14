import { OrderItemType } from 'src/constants/orders/order-item-type';
import { Entity, Column } from 'typeorm';
import { AbstractEntity } from '../abstract/abstract-entity';

@Entity()
export class OrderItem extends AbstractEntity {
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
    nullable: true,
    type: 'timestamptz',
  })
  public deletedAt: Date | null;
}
