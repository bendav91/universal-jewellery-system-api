import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { PageMetaDto } from 'src/dtos/page/page-meta.dto';
import { PageOptionsDto } from 'src/dtos/page/page-options.dto';
import { PageDto } from 'src/dtos/page/page.dto';
import { PaymentDto } from 'src/dtos/payments/payment.dto';
import { Payment } from 'src/entities/payments/payment.entity';
import { resolvePaymentsDto } from 'src/utils/payments/resolve-payments-dto';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly ordersRepository: Repository<Payment>,
    private readonly configService: ConfigService,
  ) {}

  async getPayments(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<PaymentDto>> {
    const queryBuilder = this.ordersRepository.createQueryBuilder('order');
    queryBuilder
      .orderBy('order.createdAt', pageOptionsDto.sortOrder)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const { entries } = resolvePaymentsDto(entities);

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(entries, pageMetaDto);
  }
}
