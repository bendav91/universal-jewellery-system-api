import { OrderDto } from 'src/dtos/orders/order.dto';
import { Order } from 'src/entities/orders/orders.entity';
import { Prices } from 'src/interfaces/prices.interface';
import { resolveUserDto } from '../users/resolve-user-dto';
import { resolveOrderItemDtos } from './resolve-order-item-dtos';
import { resolveOrderPrices } from './resolve-order-prices';

export const resolveOrderDtos = (orders: Order[]): OrderDto[] => {
  return orders.map((order) => {
    const orderItems = resolveOrderItemDtos(
      order.orderItems,
      order.orderNumber,
    );
    const prices: Prices = resolveOrderPrices(orderItems);
    const user = resolveUserDto(order.user);

    return new OrderDto({
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      deletedAt: order.deletedAt,
      orderNumber: order.orderNumber,
      orderItems: orderItems,
      status: order.status,
      notes: order.notes,
      paymentStatus: order.paymentStatus,
      shippingAddress: order.shippingAddress,
      user,
      ...prices,
    });
  });
};
