import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from '../../entities/orders/orders.entity';
import { OrderItem } from 'src/entities/orders/order-item.entity';
import { OrderItemsController } from './order-items.controller';
import { OrderItemsService } from './order-items.service';
import { Tax } from 'src/entities/taxes/tax.entity';
import { Payment } from 'src/entities/payments/payment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem, Tax, Payment])],
  providers: [OrderService, OrderItemsService],
  controllers: [OrdersController, OrderItemsController],
})
export class OrdersModule {}
