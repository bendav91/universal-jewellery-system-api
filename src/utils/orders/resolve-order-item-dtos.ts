import { OrderItemDto } from 'src/dtos/orders/order-item.dto';
import { OrderItem } from 'src/entities/orders/order-item.entity';
import { resolvePrices } from './resolve-prices';
import { resolveTaxDtos } from './resolve-tax-dtos';

export const resolveOrderItemDtos = (
  orderItems: OrderItem[],
  orderNumber?: string,
): OrderItemDto[] => {
  return orderItems.map((orderItem) => {
    const { grossPrice, discountAmount, taxes } = orderItem;

    const { taxDtos, taxMultiplier } = resolveTaxDtos(taxes);
    const prices = resolvePrices({ discountAmount, grossPrice, taxMultiplier });

    return new OrderItemDto({
      createdAt: orderItem.createdAt,
      updatedAt: orderItem.updatedAt,
      deletedAt: orderItem.deletedAt,
      orderItemNumber: orderItem.orderItemNumber,
      status: orderItem.status,
      taxes: taxDtos,
      orderNumber: orderNumber ?? orderItem.order.orderNumber,
      ...prices,
    });
  });
};
