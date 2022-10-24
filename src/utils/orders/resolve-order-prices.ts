import { OrderItemDto } from 'src/dtos/orders/order-item.dto';
import { Prices } from 'src/interfaces/prices.interface';
import { round } from 'src/utils/misc/round';

export const resolveOrderPrices = (orderItemDtos: OrderItemDto[]): Prices => {
  const pricesObject = orderItemDtos.reduce(
    (acc, orderItem) => {
      acc.prices.gross += orderItem.prices.gross;
      acc.prices.discount += orderItem.prices.discount;
      acc.prices.net += orderItem.prices.net;

      return acc;
    },
    {
      prices: {
        gross: 0,
        discount: 0,
        net: 0,
      },
    },
  );

  pricesObject.prices.net = round(pricesObject.prices.net, 2);

  return pricesObject;
};
