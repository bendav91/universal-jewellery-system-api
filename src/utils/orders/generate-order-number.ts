import { v4 as uuid } from 'uuid';

export const generateOrderNumber = () => {
  const guid = uuid();
  const orderNumber = guid.replace(/-/g, '').slice(0, 10).toUpperCase();
  return `${process.env.ORDER_NUMBER_PREFIX}-${orderNumber}`;
};
