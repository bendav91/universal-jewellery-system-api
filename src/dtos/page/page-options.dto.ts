import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { SortOrder } from 'src/constants/page/sort-order.enum';

export class PageOptionsDto implements Readonly<PageOptionsDto> {
  @ApiPropertyOptional({ enum: SortOrder, default: SortOrder.ASC })
  @IsEnum(SortOrder)
  @IsOptional()
  public order?: SortOrder = SortOrder.ASC;

  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  public page?: number = 1;

  @ApiPropertyOptional({
    minimum: 1,
    maximum: 50,
    default: 10,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  public take?: number = 10;

  get skip(): number {
    return (this.page - 1) * this.take;
  }
}
