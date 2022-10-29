import { OrderDto } from 'src/dtos/orders/order.dto';
import { Order } from 'src/entities/orders/orders.entity';
import { resolvePaymentsDto } from '../payments/resolve-payments-dtos';
import { resolveUserDto } from '../users/resolve-user-dto';
import { resolveOrderItemDtos } from './resolve-order-item-dtos';
import { resolveOrderPrices } from './resolve-order-prices';

export const resolveOrderDtos = (orders: Order[]): OrderDto[] => {
  return orders.map((order) => {
    const orderItems = resolveOrderItemDtos(
      order.orderItems,
      order.orderNumber,
    );

    const {
      prices: { discount, gross, net },
    } = resolveOrderPrices(orderItems);

    const user = resolveUserDto(order.user);
    const { entries, balance } = resolvePaymentsDto(order.payments, net);

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
      payments: {
        entries,
        balance,
      },
      prices: {
        discount,
        gross,
        net,
      },
    });
  });
};
