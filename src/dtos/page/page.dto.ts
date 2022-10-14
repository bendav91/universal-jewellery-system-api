import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { PageMetaDto } from './page-meta.dto';

export class PageDto<T> implements Readonly<PageDto<T>> {
  @IsArray()
  @ApiProperty({ isArray: true })
  public data: T[];

  @ApiProperty({ type: () => PageMetaDto })
  public meta: PageMetaDto;

  constructor(data: T[], meta: PageMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}
