import { Entity } from 'typeorm';
import { AbstractEntity } from '../abstract/abstract-entity';

@Entity()
export class Product extends AbstractEntity implements Readonly<Product> {
  constructor(partial: Partial<Product>) {
    const { createdAt, updatedAt, deletedAt, id, ...rest } = partial ?? {};
    super({ createdAt, updatedAt, deletedAt, id });
    Object.assign(this, rest);
  }
}
