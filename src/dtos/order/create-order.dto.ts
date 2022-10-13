import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, MaxLength } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    required: false,
    default: 'This is a test order.',
  })
  @IsOptional()
  @MaxLength(1000)
  public notes: string | null;

  @ApiProperty({
    default: '1 Barracuda Rise, Southam, Warwickshire, CV47 1AU',
  })
  @MaxLength(200)
  public shippingAddress: string;
}
