import { ApiProperty } from '@nestjs/swagger';

export abstract class AbstractDto implements Readonly<AbstractDto> {
  public updatedAt: Date;
  public createdAt: Date;
  @ApiProperty({
    nullable: true,
  })
  public deletedAt: Date | null;
  constructor(partial: Partial<AbstractDto>) {
    Object.assign(this, partial);
  }
}
