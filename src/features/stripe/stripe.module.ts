import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/entities/orders/orders.entity';
import { Payment } from 'src/entities/payments/payment.entity';
import { User } from 'src/entities/users/user.entity';
import { StripeFactory } from 'src/factories/stripe/stripe.factory';
import { StripeService } from './stripe.service';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, Order, User])],
  providers: [StripeService, StripeFactory],
  exports: [StripeService],
})
export class StripeModule {}
