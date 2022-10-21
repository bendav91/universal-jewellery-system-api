import { ApiProperty } from '@nestjs/swagger';

export class TaxDto implements Readonly<TaxDto> {
  public name: string;
  public rate: number;
  public description: string;
  public createdAt: Date;
  @ApiProperty({
    nullable: true,
  })
  public deletedAt: Date | null;
  public updatedAt: Date;

  constructor(partial: Partial<TaxDto>) {
    Object.assign(this, partial);
  }
}
