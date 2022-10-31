import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentType } from 'src/constants/payments/payment-type.enum';
import { Auth0UserRequestDto } from 'src/dtos/auth/auth0-user.dto';
import { ChargePaymentDto } from 'src/dtos/payments/charge-payment.dto';
import { Order } from 'src/entities/orders/orders.entity';
import { Payment } from 'src/entities/payments/payment.entity';
import { User } from 'src/entities/users/user.entity';
import Stripe from 'stripe';
import { Repository } from 'typeorm';

@Injectable()
export class StripeService {
  private readonly client: Stripe;
  private readonly logger = new Logger('StripeService');

  constructor(
    @Inject('STRIPE_SERVICE') client,
    private readonly configService: ConfigService,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {
    this.client = client;
  }

  async createCheckoutSession(
    chargePaymentDto: ChargePaymentDto,
  ): Promise<Stripe.Checkout.Session> {
    const user = await this.usersRepository.findOne({
      where: { id: chargePaymentDto.userId },
    });

    const order = await this.ordersRepository.findOne({
      where: { orderNumber: chargePaymentDto.orderNumber },
    });

    if (!order) throw new NotFoundException('Order not found');
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
                orderNumber: chargePaymentDto.orderNumber,
              },
              description: lineItem.productDescription,
            },
          },
        };
      });

    try {
      const session = await this.client.checkout.sessions.create({
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
      return session;
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException('Error returned from payment provider');
    }
  }

  async handleWebhookRequest(stripeSignature, request) {
    let event: Stripe.Event;
    const secret = this.configService.get('STRIPE_WEBHOOK_SECRET');

    try {
      event = this.client.webhooks.constructEvent(
        request,
        stripeSignature,
        secret,
      );
    } catch (err) {
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }

    const stripeObject = event.data.object;

    switch (event.type) {
      case 'checkout.session.completed': {
        const completedSession = stripeObject as Stripe.Checkout.Session;
        await this.createNewPaymentFromSessionCompletedEvent(completedSession);
        break;
      }
      default:
        this.logger.warn(`Unhandled event type ${event.type}`);
    }
  }

  private async createNewPaymentFromSessionCompletedEvent(
    session: Stripe.Checkout.Session,
  ) {
    let orderNumber: string;
    let checkoutSession: Stripe.Checkout.Session;
    let payment: Payment;
    let order: Order;

    try {
      checkoutSession = await this.client.checkout.sessions.retrieve(
        session.id,
        {
          expand: ['payment_intent'],
        },
      );
      orderNumber = checkoutSession.metadata.orderNumber;
    } catch (error) {
      this.logger.error(`Error fetching stripe session: ${error.message}`);
    }

    const paid = checkoutSession.payment_status === 'paid';

    if (!orderNumber) {
      this.logger.error(
        `No order number was included in session metadata: ${session.id}`,
      );
      return;
    }

    if (!paid) {
      this.logger.error(
        `Checkout session wasn't marked as paid: ${session.id}`,
      );
      return;
    }

    const { amount_received } =
      checkoutSession.payment_intent as Stripe.PaymentIntent;

    try {
      payment = new Payment({
        amount: amount_received / 100,
        paymentType: PaymentType.ONLINE,
        paymentProviderReference: checkoutSession.id,
        paymentProvider: 'stripe',
      });
      await this.paymentRepository.save(payment);
    } catch (error) {
      this.logger.error(`Error creating new payment: ${error.message}`);
    }

    try {
      order = await this.ordersRepository.findOne({
        where: { orderNumber },
        relationLoadStrategy: 'join',
        loadEagerRelations: true,
      });
    } catch {
      this.logger.error(
        `Order not found, could not assign payment: ${orderNumber}`,
      );
      return;
    }

    try {
      const payments = order?.payments ?? [];
      await this.ordersRepository.save({
        ...order,
        payments: [...payments, payment],
      });
    } catch (error) {
      this.logger.error(
        `Error saving new payment against order: ${error.message}`,
      );
    }
  }

  async createStripeCustomerWithUser(
    auth0user: Auth0UserRequestDto,
  ): Promise<Stripe.Customer> {
    try {
      const stripeCustomer = await this.client.customers.create({
        email: auth0user.user.email,
        name: auth0user.user.name,
        metadata: {
          userId: auth0user.user.user_id,
        },
      });
      return stripeCustomer;
    } catch (error) {
      this.logger.error(error);
      throw new ServiceUnavailableException(
        'Unable to create payment customer',
      );
    }
  }

  async updateStripeCustomerWithUser(
    auth0user: Auth0UserRequestDto,
    paymentCustomerId: string,
  ): Promise<Stripe.Customer> {
    try {
      const stripeCustomer = await this.client.customers.update(
        paymentCustomerId,
        {
          email: auth0user.user.email,
          name: auth0user.user.name,
          metadata: {
            userId: auth0user.user.user_id,
          },
        },
      );
      return stripeCustomer;
    } catch (error) {
      this.logger.error(error);
      throw new ServiceUnavailableException(
        'Unable to update payment customer',
      );
    }
  }
}
