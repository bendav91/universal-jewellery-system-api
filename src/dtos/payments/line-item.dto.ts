import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    example: `Test Product ${new Date().toISOString()}`,
  })
  productName: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 1,
  })
  productId: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    example: 'A Product Description',
  })
  productDescription?: string;

  @IsDecimal()
  @IsNotEmpty()
  @ApiProperty({
    example: 1287.56,
  })
  amount: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 1,
  })
  quantity: number;

  constructor(partial: Partial<LineItemDto>) {
    Object.assign(this, partial);
  }
}
