import { ColumnDecimalTransformer } from 'src/transformers/columnDecimalTransformer.transformer';
import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../abstract/abstract-entity';

@Entity()
export class Tax extends AbstractEntity implements Readonly<Tax> {
  @Column({
    type: 'varchar',
    length: 50,
    default: `VAT`,
  })
  public name: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0.2,
    transformer: new ColumnDecimalTransformer(),
  })
  public rate: number;

  @Column({
    type: 'varchar',
    length: 50,
    default: `UK VAT Rate`,
  })
  public description: string;

  constructor(partial: Partial<Tax>) {
    const { createdAt, updatedAt, deletedAt, id, ...rest } = partial ?? {};
    super({ createdAt, updatedAt, deletedAt, id });
    Object.assign(this, rest);
  }
}
