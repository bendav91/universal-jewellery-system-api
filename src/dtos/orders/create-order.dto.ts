import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, MaxLength } from 'class-validator';

export class CreateOrderDto implements Readonly<CreateOrderDto> {
  @ApiProperty({
    required: false,
    default: 'This is a test order.',
  })
  @IsOptional()
  @MaxLength(1000)
  public notes: string | null;

  @ApiProperty({
    required: true,
    default: 'auth0|73205c350b4ed9932f829afb2',
  })
  @MaxLength(80)
  public userId: string | null;

  @ApiProperty({
    default: '1 Barracuda Rise, Southam, Warwickshire, CV47 1AU',
  })
  @MaxLength(200)
  public shippingAddress: string;

  constructor(partial: Partial<CreateOrderDto>) {
    Object.assign(this, partial);
  }
}
