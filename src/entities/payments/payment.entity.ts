import { PaymentType } from 'src/constants/payments/payment-type.enum';
import { ColumnDecimalTransformer } from 'src/transformers/columnDecimalTransformer.transformer';
import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../abstract/abstract-entity';

@Entity()
export class Payment extends AbstractEntity implements Readonly<Payment> {
  @Column({
    type: 'uuid',
    generated: 'uuid',
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
