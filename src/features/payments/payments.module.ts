import { Module } from '@nestjs/common';
import { Payment } from 'src/entities/payments/payment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { Order } from 'src/entities/orders/orders.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, Order])],
  providers: [PaymentsService],
  controllers: [PaymentsController],
})
export class PaymentsModule {}
