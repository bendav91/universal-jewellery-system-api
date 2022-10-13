import { Exclude } from 'class-transformer';
import { generateOrderNumber } from 'src/utils/generate-order-number';
import { Entity, Column, BeforeInsert } from 'typeorm';
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
  public notes: string | null;

  @BeforeInsert()
  @Exclude()
  public setOrderNumber() {
    this.orderNumber = generateOrderNumber();
  }
}
