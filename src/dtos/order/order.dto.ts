import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class OrderDto {
  @ApiProperty()
  public orderNumber: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional({})
  public notes?: string;

  @ApiProperty()
  public shippingAddress: string;

  @ApiProperty()
  public updatedAt: Date;

  @ApiProperty()
  public createdAt: Date;
}
