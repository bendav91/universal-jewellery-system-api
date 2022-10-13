import { ApiProperty } from '@nestjs/swagger';

export class OrderDto {
  @ApiProperty()
  public orderNumber: string;

  @ApiProperty()
  public notes: string | null;

  @ApiProperty()
  public shippingAddress: string;

  @ApiProperty()
  public updatedAt: Date;

  @ApiProperty()
  public createdAt: Date;
}
