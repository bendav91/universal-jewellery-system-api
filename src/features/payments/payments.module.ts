import { Module } from '@nestjs/common';
import { Payment } from 'src/entities/payments/payment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { Order } from 'src/entities/orders/orders.entity';
import { StripeFactory } from '../stripe/stripe.factory';
import { User } from 'src/entities/users/user.entity';
import { StripeModule } from '../stripe/stripe.module';

@Module({
  imports: [StripeModule, TypeOrmModule.forFeature([Payment, Order, User])],
  providers: [PaymentsService, StripeFactory],
  controllers: [PaymentsController],
})
export class PaymentsModule {}
