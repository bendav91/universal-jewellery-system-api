import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUrl } from 'class-validator';

export class CheckoutLinkDto implements Readonly<CheckoutLinkDto> {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  checkoutUrl: string;

  constructor(partial: Partial<CheckoutLinkDto>) {
    Object.assign(this, partial);
  }
}
