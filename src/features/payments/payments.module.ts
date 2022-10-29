import { Module } from '@nestjs/common';
import { Payment } from 'src/entities/payments/payment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Payment])],
  providers: [PaymentsService],
  controllers: [PaymentsController],
})
export class PaymentsModule {}
