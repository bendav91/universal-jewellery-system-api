import { Prices } from 'src/interfaces/prices.interface';
import { round } from '../misc/round';

export const resolvePrices = ({
  grossPrice,
  discountAmount,
  taxMultiplier,
}: {
  grossPrice: number;
  discountAmount: number;
  taxMultiplier: number;
}): Prices => {
  const gross = round(grossPrice, 2);
  const discount = round(discountAmount, 2);
  const net = round((gross - discount) * taxMultiplier, 2);

  return { prices: { gross, net, discount } };
};
