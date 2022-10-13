import { Entity, Column } from 'typeorm';
import { AbstractEntity } from './abstract/abstract-entity';

@Entity({
  name: 'orders',
})
export class Order extends AbstractEntity {
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
}
