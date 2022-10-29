import { PaymentType } from 'src/constants/payments/payment-type.enum';
import { ColumnDecimalTransformer } from 'src/transformers/columnDecimalTransformer.transformer';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { AbstractEntity } from '../abstract/abstract-entity';
import { Order } from '../orders/orders.entity';

@Entity()
export class Payment extends AbstractEntity implements Readonly<Payment> {
  @PrimaryColumn({
    type: 'uuid',
  })
  public paymentId: string;

  @Column({
    type: 'uuid',
  })
  public idempotencyKey: string;

  @Column({
    type: 'enum',
    enum: PaymentType,
    default: PaymentType.OTHER,
    enumName: 'paymentTypeEnum',
  })
  public paymentType: PaymentType;

  @Column({
    nullable: true,
  })
  public paymentProvider: string;

  @Column({
    nullable: true,
  })
  public paymentProviderReference: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0.0,
    transformer: new ColumnDecimalTransformer(),
  })
  public amount: number;

  constructor(partial: Partial<Payment>) {
    const { createdAt, updatedAt, deletedAt, id, ...rest } = partial ?? {};
    super({ createdAt, updatedAt, deletedAt, id });
    Object.assign(this, rest);
  }
}
