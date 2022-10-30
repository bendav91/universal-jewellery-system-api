import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SortOrder } from 'src/constants/page/sort-order.enum';
import { PageMetaDto } from 'src/dtos/page/page-meta.dto';
import { PageOptionsDto } from 'src/dtos/page/page-options.dto';
import { PageDto } from 'src/dtos/page/page.dto';
import { PaymentDto } from 'src/dtos/payments/payment.dto';
import { Order } from 'src/entities/orders/orders.entity';
import { Payment } from 'src/entities/payments/payment.entity';
import { resolvePaymentsDto } from 'src/utils/payments/resolve-payments-dto';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
  ) {}

  async getPayments(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<PaymentDto>> {
    const queryBuilder = this.paymentRepository.createQueryBuilder('payment');
    queryBuilder
      .orderBy('payment.createdAt', pageOptionsDto.sortOrder)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const { entries } = resolvePaymentsDto(entities);

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(entries, pageMetaDto);
  }

  async getPaymentsByOrderNumber(orderNumber: string): Promise<PaymentDto[]> {
    if (!orderNumber) throw new BadRequestException('Order number is required');
    const queryBuilder = this.ordersRepository.createQueryBuilder('order');
    queryBuilder
      .where('order.orderNumber = :orderNumber', { orderNumber: orderNumber })
      .limit(1)
      .leftJoinAndSelect('order.payments', 'payments')
      .orderBy('order.createdAt', SortOrder.DESC);
    const { entities } = await queryBuilder.getRawAndEntities();
    if (!entities?.length) throw new NotFoundException('Order not found');
    const { entries } = resolvePaymentsDto(entities[0].payments);
    return entries ?? [];
  }
}
