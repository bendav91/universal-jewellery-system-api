import { v4 as uuid } from 'uuid';

export const generateOrderNumber = (orderNumberPrefix: string) => {
  const guid = uuid();
  const orderNumber = guid.replace(/-/g, '').slice(0, 10).toUpperCase();
  return `${orderNumberPrefix}-${orderNumber}`;
};
