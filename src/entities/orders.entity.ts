import { Entity, Column, Generated } from 'typeorm';
import { AbstractEntity } from './abstract/abstract-entity';

@Entity({
  name: 'orders',
})
export class Order extends AbstractEntity {
  @Generated('uuid')
  public orderNumber: string;

  @Column()
  public notes: string;

  @Column()
  public shippingAddress: string;
}
