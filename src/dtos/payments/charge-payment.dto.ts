import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { LineItemDto } from './line-item.dto';

export class ChargePaymentDto implements Readonly<ChargePaymentDto> {
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  @ApiProperty({
    example: 'auth0|73205c350b4ed9932f829afb2',
  })
  public userId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'http://localhost:3000/',
  })
  public cancelUrl: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'http://localhost:3000/',
  })
  public successUrl: string;

  @IsNotEmpty()
  @ApiProperty()
  public lineItems: LineItemDto[];

  @IsNotEmpty()
  @IsString()
  @MaxLength(13)
  @ApiProperty({
    maxLength: 13,
    example: 'UJ-7A921E567F',
  })
  public orderNumber: string;

  constructor(partial: Partial<ChargePaymentDto>) {
    Object.assign(this, partial);
  }
}
