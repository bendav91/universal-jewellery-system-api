import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
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
import Stripe from 'stripe';
import { ChargePaymentDto } from 'src/dtos/payments/charge-payment.dto';
import { User } from 'src/entities/users/user.entity';

@Injectable()
export class PaymentsService {
  private readonly stripeService: Stripe;
  private readonly logger: Logger;

  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @Inject('STRIPE_SERVICE') stripeService,
  ) {
    this.stripeService = stripeService;
    this.logger = new Logger('PaymentsService');
  }

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

  async createCheckoutSession(
    chargePaymentDto: ChargePaymentDto,
  ): Promise<Stripe.Checkout.Session> {
    const user = await this.usersRepository.findOne({
      where: { id: chargePaymentDto.userId },
    });

    if (!user) throw new NotFoundException('User not found');
    if (!user.paymentGatewayCustomerId)
      throw new NotFoundException('No payment gateway id for user');

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
      chargePaymentDto.lineItems.map((lineItem) => {
        const unit_amount_decimal = `${lineItem.amount * 100}`;

        return {
          quantity: lineItem.quantity,
          price_data: {
            currency: 'gbp',
            unit_amount_decimal,
            product_data: {
              name: lineItem.productName,
              metadata: {
                productId: lineItem.productId,
              },
              description: lineItem.productDescription,
            },
          },
        };
      });

    try {
      return await this.stripeService.checkout.sessions.create({
        cancel_url: chargePaymentDto.cancelUrl,
        success_url: chargePaymentDto.successUrl,
        customer: user.paymentGatewayCustomerId,
        line_items: lineItems,
        client_reference_id: user.id,
        mode: 'payment',
        submit_type: 'pay',
        payment_method_types: ['card'],
        currency: 'gbp',
        metadata: {
          orderNumber: chargePaymentDto.orderNumber,
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException('Error returned from payment provider');
    }
  }
}
