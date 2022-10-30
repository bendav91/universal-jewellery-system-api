/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentType } from 'src/constants/payments/payment-type.enum';
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

    const stripeObject = event.data.object as never;

    let charge: Stripe.Charge;

    switch (event.type) {
      case 'charge.succeeded': {
        charge = stripeObject;
        await this.createNewPaymentFromChargeSucceededEvent(charge);
        break;
      }
      default:
        this.logger.warn(`Unhandled event type ${event.type}`);
    }
  }

  private async createNewPaymentFromChargeSucceededEvent(
    charge: Stripe.Charge,
  ) {
    try {
      const payment = new Payment({
        amount: charge.amount / 100,
        paymentType: PaymentType.ONLINE,
        paymentProviderReference: charge.id,
        paymentProvider: 'stripe',
      });
      return await this.paymentRepository.save(payment);
    } catch (error) {
      this.logger.error(`Error creating new payment: ${error.message}`);
    }
  }
}

/* Unused cases 
  case 'account.updated':
    account = stripeObject;
    // Then define and call a function to handle the event account.updated
    break;
  case 'account.external_account.created':
    externalAccount = stripeObject;
    // Then define and call a function to handle the event account.external_account.created
    break;
  case 'account.external_account.deleted':
    externalAccount = stripeObject;
    // Then define and call a function to handle the event account.external_account.deleted
    break;
  case 'account.external_account.updated':
    externalAccount = stripeObject;
    // Then define and call a function to handle the event account.external_account.updated
    break;
  case 'balance.available':
    balance = stripeObject;
    // Then define and call a function to handle the event balance.available
    break;
  case 'billing_portal.configuration.created':
    configuration = stripeObject;
    // Then define and call a function to handle the event billing_portal.configuration.created
    break;
  case 'billing_portal.configuration.updated':
    configuration = stripeObject;
    // Then define and call a function to handle the event billing_portal.configuration.updated
    break;
  case 'billing_portal.session.created':
    session = stripeObject;
    // Then define and call a function to handle the event billing_portal.session.created
    break;
  case 'capability.updated':
    capability = stripeObject;
    // Then define and call a function to handle the event capability.updated
    break;
  case 'cash_balance.funds_available':
    cashBalance = stripeObject;
    // Then define and call a function to handle the event cash_balance.funds_available
    break;
  case 'charge.captured':
    charge = stripeObject;
    // Then define and call a function to handle the event charge.captured
    break;
  case 'charge.expired':
    charge = stripeObject;
    // Then define and call a function to handle the event charge.expired
    break;
  case 'charge.failed':
    charge = stripeObject;
    // Then define and call a function to handle the event charge.failed
    break;
  case 'charge.pending':
    charge = stripeObject;
    // Then define and call a function to handle the event charge.pending
    break;
  case 'charge.refunded':
    charge = stripeObject;
    // Then define and call a function to handle the event charge.refunded
    break;
  case 'charge.updated':
    charge = stripeObject;
    // Then define and call a function to handle the event charge.updated
    break;
  case 'charge.dispute.closed':
    dispute = stripeObject;
    // Then define and call a function to handle the event charge.dispute.closed
    break;
  case 'charge.dispute.created':
    dispute = stripeObject;
    // Then define and call a function to handle the event charge.dispute.created
    break;
  case 'charge.dispute.funds_reinstated':
    dispute = stripeObject;
    // Then define and call a function to handle the event charge.dispute.funds_reinstated
    break;
  case 'charge.dispute.funds_withdrawn':
    dispute = stripeObject;
    // Then define and call a function to handle the event charge.dispute.funds_withdrawn
    break;
  case 'charge.dispute.updated':
    dispute = stripeObject;
    // Then define and call a function to handle the event charge.dispute.updated
    break;
  case 'charge.refund.updated':
    refund = stripeObject;
    // Then define and call a function to handle the event charge.refund.updated
    break;
  case 'checkout.session.async_payment_failed':
    session = stripeObject;
    // Then define and call a function to handle the event checkout.session.async_payment_failed
    break;
  case 'checkout.session.async_payment_succeeded':
    session = stripeObject;
    // Then define and call a function to handle the event checkout.session.async_payment_succeeded
    break;
  case 'checkout.session.completed':
    session = stripeObject;
    // Then define and call a function to handle the event checkout.session.completed
    break;
  case 'checkout.session.expired':
    session = stripeObject;
    // Then define and call a function to handle the event checkout.session.expired
    break;
  case 'coupon.created':
    coupon = stripeObject;
    // Then define and call a function to handle the event coupon.created
    break;
  case 'coupon.deleted':
    coupon = stripeObject;
    // Then define and call a function to handle the event coupon.deleted
    break;
  case 'coupon.updated':
    coupon = stripeObject;
    // Then define and call a function to handle the event coupon.updated
    break;
  case 'credit_note.created':
    creditNote = stripeObject;
    // Then define and call a function to handle the event credit_note.created
    break;
  case 'credit_note.updated':
    creditNote = stripeObject;
    // Then define and call a function to handle the event credit_note.updated
    break;
  case 'credit_note.voided':
    creditNote = stripeObject;
    // Then define and call a function to handle the event credit_note.voided
    break;
  case 'customer.created':
    customer = stripeObject;
    // Then define and call a function to handle the event customer.created
    break;
  case 'customer.deleted':
    customer = stripeObject;
    // Then define and call a function to handle the event customer.deleted
    break;
  case 'customer.updated':
    customer = stripeObject;
    // Then define and call a function to handle the event customer.updated
    break;
  case 'customer.discount.created':
    discount = stripeObject;
    // Then define and call a function to handle the event customer.discount.created
    break;
  case 'customer.discount.deleted':
    discount = stripeObject;
    // Then define and call a function to handle the event customer.discount.deleted
    break;
  case 'customer.discount.updated':
    discount = stripeObject;
    // Then define and call a function to handle the event customer.discount.updated
    break;
  case 'customer.source.created':
    source = stripeObject;
    // Then define and call a function to handle the event customer.source.created
    break;
  case 'customer.source.deleted':
    source = stripeObject;
    // Then define and call a function to handle the event customer.source.deleted
    break;
  case 'customer.source.expiring':
    source = stripeObject;
    // Then define and call a function to handle the event customer.source.expiring
    break;
  case 'customer.source.updated':
    source = stripeObject;
    // Then define and call a function to handle the event customer.source.updated
    break;
  case 'customer.subscription.created':
    subscription = stripeObject;
    // Then define and call a function to handle the event customer.subscription.created
    break;
  case 'customer.subscription.deleted':
    subscription = stripeObject;
    // Then define and call a function to handle the event customer.subscription.deleted
    break;
  case 'customer.subscription.pending_update_applied':
    subscription = stripeObject;
    // Then define and call a function to handle the event customer.subscription.pending_update_applied
    break;
  case 'customer.subscription.pending_update_expired':
    subscription = stripeObject;
    // Then define and call a function to handle the event customer.subscription.pending_update_expired
    break;
  case 'customer.subscription.trial_will_end':
    subscription = stripeObject;
    // Then define and call a function to handle the event customer.subscription.trial_will_end
    break;
  case 'customer.subscription.updated':
    subscription = stripeObject;
    // Then define and call a function to handle the event customer.subscription.updated
    break;
  case 'customer.tax_id.created':
    taxId = stripeObject;
    // Then define and call a function to handle the event customer.tax_id.created
    break;
  case 'customer.tax_id.deleted':
    taxId = stripeObject;
    // Then define and call a function to handle the event customer.tax_id.deleted
    break;
  case 'customer.tax_id.updated':
    taxId = stripeObject;
    // Then define and call a function to handle the event customer.tax_id.updated
    break;
  case 'customer_cash_balance_transaction.created':
    customerCashBalanceTransaction = stripeObject;
    // Then define and call a function to handle the event customer_cash_balance_transaction.created
    break;
  case 'file.created':
    file = stripeObject;
    // Then define and call a function to handle the event file.created
    break;
  case 'financial_connections.account.created':
    account = stripeObject;
    // Then define and call a function to handle the event financial_connections.account.created
    break;
  case 'financial_connections.account.deactivated':
    account = stripeObject;
    // Then define and call a function to handle the event financial_connections.account.deactivated
    break;
  case 'financial_connections.account.disconnected':
    account = stripeObject;
    // Then define and call a function to handle the event financial_connections.account.disconnected
    break;
  case 'financial_connections.account.reactivated':
    account = stripeObject;
    // Then define and call a function to handle the event financial_connections.account.reactivated
    break;
  case 'financial_connections.account.refreshed_balance':
    account = stripeObject;
    // Then define and call a function to handle the event financial_connections.account.refreshed_balance
    break;
  case 'identity.verification_session.canceled':
    verificationSession = stripeObject;
    // Then define and call a function to handle the event identity.verification_session.canceled
    break;
  case 'identity.verification_session.created':
    verificationSession = stripeObject;
    // Then define and call a function to handle the event identity.verification_session.created
    break;
  case 'identity.verification_session.processing':
    verificationSession = stripeObject;
    // Then define and call a function to handle the event identity.verification_session.processing
    break;
  case 'identity.verification_session.requires_input':
    verificationSession = stripeObject;
    // Then define and call a function to handle the event identity.verification_session.requires_input
    break;
  case 'identity.verification_session.verified':
    verificationSession = stripeObject;
    // Then define and call a function to handle the event identity.verification_session.verified
    break;
  case 'invoice.created':
    invoice = stripeObject;
    // Then define and call a function to handle the event invoice.created
    break;
  case 'invoice.deleted':
    invoice = stripeObject;
    // Then define and call a function to handle the event invoice.deleted
    break;
  case 'invoice.finalization_failed':
    invoice = stripeObject;
    // Then define and call a function to handle the event invoice.finalization_failed
    break;
  case 'invoice.finalized':
    invoice = stripeObject;
    // Then define and call a function to handle the event invoice.finalized
    break;
  case 'invoice.marked_uncollectible':
    invoice = stripeObject;
    // Then define and call a function to handle the event invoice.marked_uncollectible
    break;
  case 'invoice.paid':
    invoice = stripeObject;
    // Then define and call a function to handle the event invoice.paid
    break;
  case 'invoice.payment_action_required':
    invoice = stripeObject;
    // Then define and call a function to handle the event invoice.payment_action_required
    break;
  case 'invoice.payment_failed':
    invoice = stripeObject;
    // Then define and call a function to handle the event invoice.payment_failed
    break;
  case 'invoice.payment_succeeded':
    invoice = stripeObject;
    // Then define and call a function to handle the event invoice.payment_succeeded
    break;
  case 'invoice.sent':
    invoice = stripeObject;
    // Then define and call a function to handle the event invoice.sent
    break;
  case 'invoice.upcoming':
    invoice = stripeObject;
    // Then define and call a function to handle the event invoice.upcoming
    break;
  case 'invoice.updated':
    invoice = stripeObject;
    // Then define and call a function to handle the event invoice.updated
    break;
  case 'invoice.voided':
    invoice = stripeObject;
    // Then define and call a function to handle the event invoice.voided
    break;
  case 'invoiceitem.created':
    invoiceitem = stripeObject;
    // Then define and call a function to handle the event invoiceitem.created
    break;
  case 'invoiceitem.deleted':
    invoiceitem = stripeObject;
    // Then define and call a function to handle the event invoiceitem.deleted
    break;
  case 'invoiceitem.updated':
    invoiceitem = stripeObject;
    // Then define and call a function to handle the event invoiceitem.updated
    break;
  case 'issuing_authorization.created':
    issuingAuthorization = stripeObject;
    // Then define and call a function to handle the event issuing_authorization.created
    break;
  case 'issuing_authorization.updated':
    issuingAuthorization = stripeObject;
    // Then define and call a function to handle the event issuing_authorization.updated
    break;
  case 'issuing_card.created':
    issuingCard = stripeObject;
    // Then define and call a function to handle the event issuing_card.created
    break;
  case 'issuing_card.updated':
    issuingCard = stripeObject;
    // Then define and call a function to handle the event issuing_card.updated
    break;
  case 'issuing_cardholder.created':
    issuingCardholder = stripeObject;
    // Then define and call a function to handle the event issuing_cardholder.created
    break;
  case 'issuing_cardholder.updated':
    issuingCardholder = stripeObject;
    // Then define and call a function to handle the event issuing_cardholder.updated
    break;
  case 'issuing_dispute.closed':
    issuingDispute = stripeObject;
    // Then define and call a function to handle the event issuing_dispute.closed
    break;
  case 'issuing_dispute.created':
    issuingDispute = stripeObject;
    // Then define and call a function to handle the event issuing_dispute.created
    break;
  case 'issuing_dispute.funds_reinstated':
    issuingDispute = stripeObject;
    // Then define and call a function to handle the event issuing_dispute.funds_reinstated
    break;
  case 'issuing_dispute.submitted':
    issuingDispute = stripeObject;
    // Then define and call a function to handle the event issuing_dispute.submitted
    break;
  case 'issuing_dispute.updated':
    issuingDispute = stripeObject;
    // Then define and call a function to handle the event issuing_dispute.updated
    break;
  case 'issuing_transaction.created':
    issuingTransaction = stripeObject;
    // Then define and call a function to handle the event issuing_transaction.created
    break;
  case 'issuing_transaction.updated':
    issuingTransaction = stripeObject;
    // Then define and call a function to handle the event issuing_transaction.updated
    break;
  case 'mandate.updated':
    mandate = stripeObject;
    // Then define and call a function to handle the event mandate.updated
    break;
  case 'order.created':
    order = stripeObject;
    // Then define and call a function to handle the event order.created
    break;
  case 'payment_intent.amount_capturable_updated':
    paymentIntent = stripeObject;
    // Then define and call a function to handle the event payment_intent.amount_capturable_updated
    break;
  case 'payment_intent.canceled':
    paymentIntent = stripeObject;
    // Then define and call a function to handle the event payment_intent.canceled
    break;
  case 'payment_intent.created':
    paymentIntent = stripeObject;
    // Then define and call a function to handle the event payment_intent.created
    break;
  case 'payment_intent.partially_funded':
    paymentIntent = stripeObject;
    // Then define and call a function to handle the event payment_intent.partially_funded
    break;
  case 'payment_intent.payment_failed':
    paymentIntent = stripeObject;
    // Then define and call a function to handle the event payment_intent.payment_failed
    break;
  case 'payment_intent.processing':
    paymentIntent = stripeObject;
    // Then define and call a function to handle the event payment_intent.processing
    break;
  case 'payment_intent.requires_action':
    paymentIntent = stripeObject;
    // Then define and call a function to handle the event payment_intent.requires_action
    break;
  case 'payment_intent.succeeded':
    paymentIntent = stripeObject;
    // Then define and call a function to handle the event payment_intent.succeeded
    break;
  case 'payment_link.created':
    paymentLink = stripeObject;
    // Then define and call a function to handle the event payment_link.created
    break;
  case 'payment_link.updated':
    paymentLink = stripeObject;
    // Then define and call a function to handle the event payment_link.updated
    break;
  case 'payment_method.attached':
    paymentMethod = stripeObject;
    // Then define and call a function to handle the event payment_method.attached
    break;
  case 'payment_method.automatically_updated':
    paymentMethod = stripeObject;
    // Then define and call a function to handle the event payment_method.automatically_updated
    break;
  case 'payment_method.detached':
    paymentMethod = stripeObject;
    // Then define and call a function to handle the event payment_method.detached
    break;
  case 'payment_method.updated':
    paymentMethod = stripeObject;
    // Then define and call a function to handle the event payment_method.updated
    break;
  case 'payout.canceled':
    payout = stripeObject;
    // Then define and call a function to handle the event payout.canceled
    break;
  case 'payout.created':
    payout = stripeObject;
    // Then define and call a function to handle the event payout.created
    break;
  case 'payout.failed':
    payout = stripeObject;
    // Then define and call a function to handle the event payout.failed
    break;
  case 'payout.paid':
    payout = stripeObject;
    // Then define and call a function to handle the event payout.paid
    break;
  case 'payout.updated':
    payout = stripeObject;
    // Then define and call a function to handle the event payout.updated
    break;
  case 'person.created':
    person = stripeObject;
    // Then define and call a function to handle the event person.created
    break;
  case 'person.deleted':
    person = stripeObject;
    // Then define and call a function to handle the event person.deleted
    break;
  case 'person.updated':
    person = stripeObject;
    // Then define and call a function to handle the event person.updated
    break;
  case 'plan.created':
    plan = stripeObject;
    // Then define and call a function to handle the event plan.created
    break;
  case 'plan.deleted':
    plan = stripeObject;
    // Then define and call a function to handle the event plan.deleted
    break;
  case 'plan.updated':
    plan = stripeObject;
    // Then define and call a function to handle the event plan.updated
    break;
  case 'price.created':
    price = stripeObject;
    // Then define and call a function to handle the event price.created
    break;
  case 'price.deleted':
    price = stripeObject;
    // Then define and call a function to handle the event price.deleted
    break;
  case 'price.updated':
    price = stripeObject;
    // Then define and call a function to handle the event price.updated
    break;
  case 'product.created':
    product = stripeObject;
    // Then define and call a function to handle the event product.created
    break;
  case 'product.deleted':
    product = stripeObject;
    // Then define and call a function to handle the event product.deleted
    break;
  case 'product.updated':
    product = stripeObject;
    // Then define and call a function to handle the event product.updated
    break;
  case 'promotion_code.created':
    promotionCode = stripeObject;
    // Then define and call a function to handle the event promotion_code.created
    break;
  case 'promotion_code.updated':
    promotionCode = stripeObject;
    // Then define and call a function to handle the event promotion_code.updated
    break;
  case 'quote.accepted':
    quote = stripeObject;
    // Then define and call a function to handle the event quote.accepted
    break;
  case 'quote.canceled':
    quote = stripeObject;
    // Then define and call a function to handle the event quote.canceled
    break;
  case 'quote.created':
    quote = stripeObject;
    // Then define and call a function to handle the event quote.created
    break;
  case 'quote.finalized':
    quote = stripeObject;
    // Then define and call a function to handle the event quote.finalized
    break;
  case 'radar.early_fraud_warning.created':
    earlyFraudWarning = stripeObject;
    // Then define and call a function to handle the event radar.early_fraud_warning.created
    break;
  case 'radar.early_fraud_warning.updated':
    earlyFraudWarning = stripeObject;
    // Then define and call a function to handle the event radar.early_fraud_warning.updated
    break;
  case 'recipient.created':
    recipient = stripeObject;
    // Then define and call a function to handle the event recipient.created
    break;
  case 'recipient.deleted':
    recipient = stripeObject;
    // Then define and call a function to handle the event recipient.deleted
    break;
  case 'recipient.updated':
    recipient = stripeObject;
    // Then define and call a function to handle the event recipient.updated
    break;
  case 'reporting.report_run.failed':
    reportRun = stripeObject;
    // Then define and call a function to handle the event reporting.report_run.failed
    break;
  case 'reporting.report_run.succeeded':
    reportRun = stripeObject;
    // Then define and call a function to handle the event reporting.report_run.succeeded
    break;
  case 'review.closed':
    review = stripeObject;
    // Then define and call a function to handle the event review.closed
    break;
  case 'review.opened':
    review = stripeObject;
    // Then define and call a function to handle the event review.opened
    break;
  case 'setup_intent.canceled':
    setupIntent = stripeObject;
    // Then define and call a function to handle the event setup_intent.canceled
    break;
  case 'setup_intent.created':
    setupIntent = stripeObject;
    // Then define and call a function to handle the event setup_intent.created
    break;
  case 'setup_intent.requires_action':
    setupIntent = stripeObject;
    // Then define and call a function to handle the event setup_intent.requires_action
    break;
  case 'setup_intent.setup_failed':
    setupIntent = stripeObject;
    // Then define and call a function to handle the event setup_intent.setup_failed
    break;
  case 'setup_intent.succeeded':
    setupIntent = stripeObject;
    // Then define and call a function to handle the event setup_intent.succeeded
    break;
  case 'sigma.scheduled_query_run.created':
    scheduledQueryRun = stripeObject;
    // Then define and call a function to handle the event sigma.scheduled_query_run.created
    break;
  case 'sku.created':
    sku = stripeObject;
    // Then define and call a function to handle the event sku.created
    break;
  case 'sku.deleted':
    sku = stripeObject;
    // Then define and call a function to handle the event sku.deleted
    break;
  case 'sku.updated':
    sku = stripeObject;
    // Then define and call a function to handle the event sku.updated
    break;
  case 'source.canceled':
    source = stripeObject;
    // Then define and call a function to handle the event source.canceled
    break;
  case 'source.chargeable':
    source = stripeObject;
    // Then define and call a function to handle the event source.chargeable
    break;
  case 'source.failed':
    source = stripeObject;
    // Then define and call a function to handle the event source.failed
    break;
  case 'source.mandate_notification':
    source = stripeObject;
    // Then define and call a function to handle the event source.mandate_notification
    break;
  case 'source.refund_attributes_required':
    source = stripeObject;
    // Then define and call a function to handle the event source.refund_attributes_required
    break;
  case 'source.transaction.created':
    transaction = stripeObject;
    // Then define and call a function to handle the event source.transaction.created
    break;
  case 'source.transaction.updated':
    transaction = stripeObject;
    // Then define and call a function to handle the event source.transaction.updated
    break;
  case 'subscription_schedule.aborted':
    subscriptionSchedule = stripeObject;
    // Then define and call a function to handle the event subscription_schedule.aborted
    break;
  case 'subscription_schedule.canceled':
    subscriptionSchedule = stripeObject;
    // Then define and call a function to handle the event subscription_schedule.canceled
    break;
  case 'subscription_schedule.completed':
    subscriptionSchedule = stripeObject;
    // Then define and call a function to handle the event subscription_schedule.completed
    break;
  case 'subscription_schedule.created':
    subscriptionSchedule = stripeObject;
    // Then define and call a function to handle the event subscription_schedule.created
    break;
  case 'subscription_schedule.expiring':
    subscriptionSchedule = stripeObject;
    // Then define and call a function to handle the event subscription_schedule.expiring
    break;
  case 'subscription_schedule.released':
    subscriptionSchedule = stripeObject;
    // Then define and call a function to handle the event subscription_schedule.released
    break;
  case 'subscription_schedule.updated':
    subscriptionSchedule = stripeObject;
    // Then define and call a function to handle the event subscription_schedule.updated
    break;
  case 'tax_rate.created':
    taxRate = stripeObject;
    // Then define and call a function to handle the event tax_rate.created
    break;
  case 'tax_rate.updated':
    taxRate = stripeObject;
    // Then define and call a function to handle the event tax_rate.updated
    break;
  case 'terminal.reader.action_failed':
    reader = stripeObject;
    // Then define and call a function to handle the event terminal.reader.action_failed
    break;
  case 'terminal.reader.action_succeeded':
    reader = stripeObject;
    // Then define and call a function to handle the event terminal.reader.action_succeeded
    break;
  case 'test_helpers.test_clock.advancing':
    testClock = stripeObject;
    // Then define and call a function to handle the event test_helpers.test_clock.advancing
    break;
  case 'test_helpers.test_clock.created':
    testClock = stripeObject;
    // Then define and call a function to handle the event test_helpers.test_clock.created
    break;
  case 'test_helpers.test_clock.deleted':
    testClock = stripeObject;
    // Then define and call a function to handle the event test_helpers.test_clock.deleted
    break;
  case 'test_helpers.test_clock.internal_failure':
    testClock = stripeObject;
    // Then define and call a function to handle the event test_helpers.test_clock.internal_failure
    break;
  case 'test_helpers.test_clock.ready':
    testClock = stripeObject;
    // Then define and call a function to handle the event test_helpers.test_clock.ready
    break;
  case 'topup.canceled':
    topup = stripeObject;
    // Then define and call a function to handle the event topup.canceled
    break;
  case 'topup.created':
    topup = stripeObject;
    // Then define and call a function to handle the event topup.created
    break;
  case 'topup.failed':
    topup = stripeObject;
    // Then define and call a function to handle the event topup.failed
    break;
  case 'topup.reversed':
    topup = stripeObject;
    // Then define and call a function to handle the event topup.reversed
    break;
  case 'topup.succeeded':
    topup = stripeObject;
    // Then define and call a function to handle the event topup.succeeded
    break;
  case 'transfer.created':
    transfer = stripeObject;
    // Then define and call a function to handle the event transfer.created
    break;
  case 'transfer.reversed':
    transfer = stripeObject;
    // Then define and call a function to handle the event transfer.reversed
    break;
  case 'transfer.updated':
    transfer = stripeObject;
    // Then define and call a function to handle the event transfer.updated
    break;
*/

/* Unused event types:
  let account: Stripe.Account;
  let balance: Stripe.Balance;
  let capability: Stripe.Capability;
  let cashBalance: Stripe.CashBalance;
  let configuration: Stripe.StripeConfig;
  let coupon: Stripe.Coupon;
  let creditNote: Stripe.CreditNote;
  let customer: Stripe.Customer;
  let customerCashBalanceTransaction: Stripe.CustomerBalanceTransaction;
  let discount: Stripe.Discount;
  let dispute: Stripe.Dispute;
  let earlyFraudWarning: unknown;
  let externalAccount: unknown;
  let file: Stripe.File;
  let invoice: Stripe.Invoice;
  let invoiceitem: Stripe.InvoiceItem;
  let issuingAuthorization: Stripe.Issuing.Authorization;
  let issuingCard: Stripe.Issuing.Card;
  let issuingCardholder: Stripe.Issuing.Cardholder;
  let issuingDispute: Stripe.Issuing.Dispute;
  let issuingTransaction: Stripe.Issuing.Transaction;
  let mandate: Stripe.Mandate;
  let order: Stripe.Order;
  let paymentIntent: Stripe.PaymentIntent;
  let paymentLink: Stripe.PaymentLink;
  let paymentMethod: Stripe.PaymentMethod;
  let payout: Stripe.Payout;
  let person: Stripe.Person;
  let plan: Stripe.Plan;
  let price: Stripe.Price;
  let product: Stripe.Product;
  let promotionCode: Stripe.PromotionCode;
  let quote: Stripe.Quote;
  let reader: unknown;
  let recipient: unknown;
  let refund: Stripe.Refund;
  let reportRun: Stripe.Reporting.ReportRun;
  let review: Stripe.Review;
  let scheduledQueryRun: unknown;
  let session: unknown;
  let setupIntent: Stripe.SetupIntent;
  let sku: Stripe.Sku;
  let source: Stripe.Source;
  let subscription: Stripe.Subscription;
  let subscriptionSchedule: Stripe.SubscriptionSchedule;
  let taxId: Stripe.TaxId;
  let taxRate: Stripe.TaxRate;
  let testClock: unknown;
  let topup: Stripe.Topup;
  let transaction: unknown;
  let transfer: Stripe.Transfer;
  let verificationSession: unknown;
*/
