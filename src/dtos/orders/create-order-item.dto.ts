import { IsString, IsUppercase, Length } from 'class-validator';

export class CreateOrderItemDto implements Readonly<CreateOrderItemDto> {
  @Length(13, 13)
  @IsUppercase()
  @IsString()
  public orderNumber: string;

  constructor(partial: Partial<CreateOrderItemDto>) {
    Object.assign(this, partial);
  }
}
