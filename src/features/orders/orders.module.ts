import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from '../../entities/orders/orders.entity';
import { OrderItem } from 'src/entities/orders/order-item.entity';
import { OrderItemsController } from './order-items.controller';
import { OrderItemsService } from './order-items.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem])],
  providers: [OrdersService, OrderItemsService],
  controllers: [OrdersController, OrderItemsController],
})
export class OrdersModule {}
