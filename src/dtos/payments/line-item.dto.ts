import {
  IsDecimal,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class LineItemDto implements Readonly<LineItemDto> {
  @IsString()
  @IsNotEmpty()
  productName: string;

  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @IsString()
  @IsOptional()
  productDescription?: string;

  @IsDecimal()
  @IsNotEmpty()
  amount: number;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  constructor(partial: Partial<LineItemDto>) {
    Object.assign(this, partial);
  }
}
