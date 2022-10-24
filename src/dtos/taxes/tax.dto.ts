import { AbstractDto } from '../abstract/abstract.dto';

export class TaxDto extends AbstractDto implements Readonly<TaxDto> {
  public name: string;
  public rate: number;
  public description: string;

  constructor({ createdAt, updatedAt, deletedAt, ...rest }: Partial<TaxDto>) {
    super({ createdAt, updatedAt, deletedAt });
    Object.assign(this, rest);
  }
}
