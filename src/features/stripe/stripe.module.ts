import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from 'src/entities/payments/payment.entity';
import { StripeFactory } from 'src/factories/stripe/stripe.factory';
import { StripeService } from './stripe.service';

@Module({
  imports: [TypeOrmModule.forFeature([Payment])],
  providers: [StripeService, StripeFactory],
  exports: [StripeService],
})
export class StripeModule {}
