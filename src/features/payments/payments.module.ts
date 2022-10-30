import { Module } from '@nestjs/common';
import { Payment } from 'src/entities/payments/payment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { Order } from 'src/entities/orders/orders.entity';
import { StripeFactory } from '../../factories/stripe/stripe.factory';
import { User } from 'src/entities/users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, Order, User])],
  providers: [PaymentsService, StripeFactory],
  controllers: [PaymentsController],
})
export class PaymentsModule {}
