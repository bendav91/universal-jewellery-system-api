import { PageMetaDtoParameters } from 'src/interfaces/page-meta-dto-parameters.interface';

export class PageMetaDto implements Readonly<PageMetaDto> {
  public page: number;
  public take: number;
  public itemCount: number;
  public pageCount: number;
  public hasPreviousPage: boolean;
  public hasNextPage: boolean;

  constructor({ pageOptionsDto, itemCount }: PageMetaDtoParameters) {
    this.page = pageOptionsDto.page;
    this.take = pageOptionsDto.take;
    this.itemCount = itemCount;
    this.pageCount = Math.ceil(this.itemCount / this.take);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.pageCount;
  }
}
